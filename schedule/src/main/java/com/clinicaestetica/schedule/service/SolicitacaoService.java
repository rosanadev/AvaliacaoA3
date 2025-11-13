package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.repository.SolicitacaoRepository;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.dto.CriarSolicitacaoDTO;
import com.clinicaestetica.schedule.dto.CriarSolicitacaoReagendamentoDTO;
import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.enums.StatusSolicitacao;
import com.clinicaestetica.schedule.enums.TipoSolicitacaoAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.model.Profissional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;


    public Solicitacao criarSolicitacaoAgendamento(CriarSolicitacaoDTO dto) {
        
        // Buscar agendamento
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
            .orElseThrow(() -> new NoSuchElementException("Agendamento " + dto.getAgendamentoId() + " não encontrado"));
        
        // Buscar profissional usando o ID do DTO
        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
            .orElseThrow(() -> new NoSuchElementException("Profissional com ID " + dto.getProfissionalId() + " não encontrado"));

        // Validar se o profissional é responsável pelo agendamento
        if (!agendamento.getProfissional().getIdUsuario().equals(profissional.getIdUsuario())) {
            throw new IllegalArgumentException("Profissional só pode criar solicitação para seus próprios agendamentos");
        }

        // Criar solicitação
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setAgendamento(agendamento);
        solicitacao.setProfissional(profissional);
        solicitacao.setDescricao(dto.getDescricao());
        solicitacao.setDataCriacao(LocalDateTime.now());
        solicitacao.setTipo(dto.getTipo());
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);

        return solicitacaoRepository.save(solicitacao);
    }

    public List<Solicitacao> listarSolicitacoes() {
        return solicitacaoRepository.findAll();
    }

    public Solicitacao criarSolicitacaoReagendamento(CriarSolicitacaoReagendamentoDTO dto) {
        // 1. Buscar agendamento e profissional
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
            .orElseThrow(() -> new NoSuchElementException("Agendamento " + dto.getAgendamentoId() + " não encontrado"));
        
        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
            .orElseThrow(() -> new NoSuchElementException("Profissional com ID " + dto.getProfissionalId() + " não encontrado"));

        // 2. Regra de Negócio: Regra das 24 horas (Cliente só pode solicitar reagendamento até um dia antes)
        LocalDateTime agora = LocalDateTime.now();
        // Verifica se faltam menos de 24h. Se for o caso, horasRestantes será < 24.
        long horasRestantes = ChronoUnit.HOURS.between(agora, agendamento.getDataHora());
        
        if (horasRestantes < 24) { // Se faltarem menos de 24h
             throw new IllegalArgumentException("Não é possível solicitar reagendamento com menos de 24h de antecedência.");
        }
        
        // 3. Validação: Checar conflito de horário na nova data/hora
        boolean conflito = agendamentoRepository.existsByProfissionalIdUsuarioAndDataHoraAndStatusNot(
            profissional.getIdUsuario(),
            dto.getNovaDataHora(),
            StatusAgendamento.CANCELADO 
        );

        if (conflito) {
            throw new IllegalArgumentException("Horário indisponível para reagendamento com o profissional " + profissional.getNome());
        }

        // 4. Criar Solicitação
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setAgendamento(agendamento);
        solicitacao.setProfissional(profissional);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        solicitacao.setDescricao(dto.getDescricao() + " | Nova Data/Hora Sugerida: " + dto.getNovaDataHora().format(formatter));
        solicitacao.setDataCriacao(LocalDateTime.now());
        solicitacao.setTipo(TipoSolicitacaoAgendamento.ALTERAR); 
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);

        return solicitacaoRepository.save(solicitacao);
    }
}