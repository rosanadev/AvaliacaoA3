package com.clinicaestetica.schedule.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.repository.ServicoRepository;
import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.repository.SolicitacaoRepository;
import com.clinicaestetica.schedule.repository.AdministradorRepository; 
import com.clinicaestetica.schedule.model.Administrador;
import com.clinicaestetica.schedule.enums.StatusSolicitacao;
import com.clinicaestetica.schedule.enums.TipoSolicitacaoAgendamento;
import com.clinicaestetica.schedule.enums.StatusAgendamento;

@Service
public class AdministradorService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired 
    private ServicoRepository servicoRepository;

    public Profissional criarProfissional(Profissional profissional) {
        return profissionalRepository.save(profissional);
    }

    public Optional<Administrador> login(String email, String senha) {
        Optional<Administrador> adminOptional = administradorRepository.findByEmail(email);

        if (adminOptional.isPresent() && adminOptional.get().getSenha().equals(senha)) {
            return adminOptional;
        }
        return Optional.empty();
    }
    
    public Profissional deletarProfissional(Long id){ 
        Profissional profissional = profissionalRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Profissional com id " + id + " não encontrado"));

        profissionalRepository.deleteById(id);

        return profissional;
    }

    public Profissional atualizarProfissional(Long id, Profissional profissionalAtualizado) {
        Profissional profissionalExistente = profissionalRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Profissional com id " + id + " não encontrado"));

        // Atualizar informações pessoais editáveis
        if (profissionalAtualizado.getNome() != null) {
            profissionalExistente.setNome(profissionalAtualizado.getNome());
        }
        if (profissionalAtualizado.getEmail() != null) {
            profissionalExistente.setEmail(profissionalAtualizado.getEmail());
        }
        if (profissionalAtualizado.getTelefone() != null) {
            profissionalExistente.setTelefone(profissionalAtualizado.getTelefone());
        }

        // Atualizar endereço completo
        if (profissionalAtualizado.getCep() != null) {
            profissionalExistente.setCep(profissionalAtualizado.getCep());
        }
        if (profissionalAtualizado.getComplemento() != null) {
            profissionalExistente.setComplemento(profissionalAtualizado.getComplemento());
        }
        if (profissionalAtualizado.getBairro() != null) {
            profissionalExistente.setBairro(profissionalAtualizado.getBairro());
        }
        if (profissionalAtualizado.getCidade() != null) {
            profissionalExistente.setCidade(profissionalAtualizado.getCidade());
        }
        if (profissionalAtualizado.getEstado() != null) {
            profissionalExistente.setEstado(profissionalAtualizado.getEstado());
        }

        return profissionalRepository.save(profissionalExistente);
    }

    public Agendamento deletarAgendamento(Long id){ // com as solicitações dos profissionais
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Agendamento com id " + id + " não encontrado"));
        agendamentoRepository.deleteById(id);

        return agendamento;
    }

    public List<Solicitacao> listarSolicitacoes(){
        return solicitacaoRepository.findAll();
    }

    public List<Profissional> listarProfissionais() {
        return profissionalRepository.findAll();
    }

    public Solicitacao processarSolicitacao(Long id, StatusSolicitacao novoStatus) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Solicitação com ID " + id + " não encontrada"));

        // Regra de Negócio: O Admin só pode aprovar ou recusar
        if (novoStatus == StatusSolicitacao.PENDENTE) {
            throw new IllegalArgumentException("Não é possível alterar o status de uma solicitação para PENDENTE.");
        }

        // Regra de Negócio: Não pode processar uma solicitação que já foi processada
        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new IllegalArgumentException("A solicitação já foi processada (Status: " + solicitacao.getStatus() + ").");
        }
        
        solicitacao.setStatus(novoStatus);

        // Se APROVADA, atualiza o Agendamento
        if (novoStatus == StatusSolicitacao.APROVADA) {
            Agendamento agendamento = solicitacao.getAgendamento();
            
            if (agendamento == null) {
                throw new IllegalStateException("Agendamento associado à solicitação é nulo.");
            }

            if (solicitacao.getTipo() == TipoSolicitacaoAgendamento.CANCELAR) {
                agendamento.setStatus(StatusAgendamento.CANCELADO);
                agendamento.setDataCancelamento(LocalDateTime.now());
                agendamentoRepository.save(agendamento);
            } else if (solicitacao.getTipo() == TipoSolicitacaoAgendamento.ALTERAR) {
                // A aprovação de ALTERAR apenas marca o agendamento como alterado para que o Admin ppossa posteriormente reagendar ou tomar a próxima ação.
                agendamento.setStatus(StatusAgendamento.ALTERADO);
                agendamentoRepository.save(agendamento);
            }
        }

        return solicitacaoRepository.save(solicitacao);
    }

    public Agendamento atualizarAgendamentoDireto(Long id, Agendamento agendamentoAtualizado) {
        Agendamento agendamentoExistente = agendamentoRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Agendamento com id " + id + " não encontrado para edição."));

        // 1. Atualiza Data/Hora
        if (agendamentoAtualizado.getDataHora() != null) {
            agendamentoExistente.setDataHora(agendamentoAtualizado.getDataHora());
            // Atualiza status para ALTERADO se a hora foi modificada
            if (agendamentoExistente.getStatus() != StatusAgendamento.CONCLUÍDO && 
                agendamentoExistente.getStatus() != StatusAgendamento.CANCELADO) {
                agendamentoExistente.setStatus(StatusAgendamento.ALTERADO);
            }
        }

        // 2. Atualiza Status
        if (agendamentoAtualizado.getStatus() != null) {
            agendamentoExistente.setStatus(agendamentoAtualizado.getStatus());
        }
        
        // 3. Atualiza Profissional (se um novo ID for fornecido)
        if (agendamentoAtualizado.getProfissional() != null && agendamentoAtualizado.getProfissional().getIdUsuario() != null) {
            Profissional novoProfissional = profissionalRepository.findById(agendamentoAtualizado.getProfissional().getIdUsuario())
                .orElseThrow(() -> new NoSuchElementException("Profissional com ID " + agendamentoAtualizado.getProfissional().getIdUsuario() + " não encontrado para edição de agendamento."));
            agendamentoExistente.setProfissional(novoProfissional);
        }
        
        // 4. Atualiza Serviço (se um novo ID for fornecido)
        if (agendamentoAtualizado.getServico() != null && agendamentoAtualizado.getServico().getId() != null) {
            Servico novoServico = servicoRepository.findById(agendamentoAtualizado.getServico().getId())
                .orElseThrow(() -> new NoSuchElementException("Serviço com ID " + agendamentoAtualizado.getServico().getId() + " não encontrado para edição de agendamento."));
            agendamentoExistente.setServico(novoServico);
        }

        return agendamentoRepository.save(agendamentoExistente);
    }
}
