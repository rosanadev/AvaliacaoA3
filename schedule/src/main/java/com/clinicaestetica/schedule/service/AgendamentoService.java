package com.clinicaestetica.schedule.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.RoundingMode;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.model.Pagamento;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.repository.ClienteRepository;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.repository.ServicoRepository;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    // Listar todos
    public List<Agendamento> listarAgendamentos() {
        return agendamentoRepository.findAll();
    }

    // Listar por status
    public List<Agendamento> listarPorStatus(StatusAgendamento status) {
        return agendamentoRepository.findByStatus(status);
    }

    // Listar agendamentos passados (concluídos ou cancelados)
    public List<Agendamento> listarAgendamentosPassados() {
        return agendamentoRepository.findAll().stream()
                .filter(a -> a.getStatus() == StatusAgendamento.CONCLUÍDO || 
                             a.getStatus() == StatusAgendamento.CANCELADO)
                .collect(Collectors.toList());
    }

    // Agendar novo serviço com pagamento parcial
    public Agendamento agendarServico(Agendamento agendamento) {
        if (agendamento.getCliente().getIdUsuario() == null) {
            throw new RuntimeException("Cliente não encontrado.");
        }

        int hora = agendamento.getDataHora().getHour();
        if (hora < 8 || hora >= 18) {
            throw new RuntimeException("Horário fora do expediente (8h-18h).");
        }

        if (agendamento.getDataHora().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Não é possível agendar em data passada.");
        }

        Cliente cliente = clienteRepository.findById(agendamento.getCliente().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        Profissional profissional = profissionalRepository.findById(agendamento.getProfissional().getIdUsuario())
                .orElseThrow(() -> new RuntimeException("Profissional não encontrado."));

        Servico servico = servicoRepository.findById(agendamento.getServico().getId())
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));

        boolean conflito = agendamentoRepository.existsByProfissionalIdUsuarioAndDataHoraAndStatusNot(
                profissional.getIdUsuario(),
                agendamento.getDataHora(),
                StatusAgendamento.CANCELADO
        );
        if (conflito) {
            throw new RuntimeException("Horário indisponível.");
        }

        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setStatus(StatusAgendamento.AGENDADO);

        // Cria pagamento
        Pagamento pagamento = new Pagamento();
        if (agendamento.isPagamentoParcial()) {
            pagamento.setValor(servico.getPreco()
                .divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP));
        } else {
            pagamento.setValor(servico.getPreco());
        }
        pagamento.setAgendamento(agendamento);
        agendamento.setPagamento(pagamento);

        return agendamentoRepository.save(agendamento);
    }

    // Cancelar (regra de 24h)
    public boolean cancelarAgendamento(Long id) {
        Optional<Agendamento> optional = agendamentoRepository.findById(id);
        if (optional.isPresent()) {
            Agendamento agendamento = optional.get();
            LocalDateTime agora = LocalDateTime.now();
            if (agendamento.getDataHora().isBefore(agora.plusHours(24))) {
                throw new RuntimeException("Não é possível cancelar agendamento com menos de 24h.");
            }
            agendamento.setStatus(StatusAgendamento.CANCELADO);
            agendamento.setDataCancelamento(agora);
            agendamentoRepository.save(agendamento);
            return true;
        }
        return false;
    }

    // Reagendar
    public Agendamento reagendarAgendamento(Long id, LocalDateTime novaDataHora) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado."));

        LocalDateTime agora = LocalDateTime.now();
        if (agendamento.getDataHora().isBefore(agora.plusHours(24))) {
            throw new RuntimeException("Não é possível reagendar com menos de 24h de antecedência.");
        }

        boolean conflito = agendamentoRepository.existsByProfissionalIdUsuarioAndDataHoraAndStatusNot(
                agendamento.getProfissional().getIdUsuario(),
                novaDataHora,
                StatusAgendamento.CANCELADO
        );
        if (conflito) {
            throw new RuntimeException("Horário indisponível.");
        }

        agendamento.setDataHora(novaDataHora);
        agendamento.setStatus(StatusAgendamento.ALTERADO);
        return agendamentoRepository.save(agendamento);
    }

    // Buscar por ID
    public Optional<Agendamento> getAgendamento(Long id) {
        return agendamentoRepository.findById(id);
    }

     public Agendamento atualizarStatus(Long id, StatusAgendamento novoStatus) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado."));

        agendamento.setStatus(novoStatus);
        return agendamentoRepository.save(agendamento);
    }
}
