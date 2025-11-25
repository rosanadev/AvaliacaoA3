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
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.format.DateTimeFormatter;


@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;


    public Solicitacao criarSolicitacaoAgendamento(CriarSolicitacaoDTO dto) {
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
            .orElseThrow(() -> new NoSuchElementException("Agendamento " + dto.getAgendamentoId() + " não encontrado"));
        
        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
            .orElseThrow(() -> new NoSuchElementException("Profissional com ID " + dto.getProfissionalId() + " não encontrado"));

        if (!agendamento.getProfissional().getIdUsuario().equals(profissional.getIdUsuario())) {
            throw new IllegalArgumentException("Profissional só pode criar solicitação para seus próprios agendamentos");
        }

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new IllegalArgumentException("Este agendamento já está cancelado.");
        }

        boolean temPendente = agendamento.getSolicitacoes().stream()
            .anyMatch(s -> s.getStatus() == StatusSolicitacao.PENDENTE);
        
        if (temPendente) {
            throw new IllegalArgumentException("Este agendamento já possui uma solicitação pendente.");
        }

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
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
            .orElseThrow(() -> new NoSuchElementException("Agendamento " + dto.getAgendamentoId() + " não encontrado"));
        
        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
            .orElseThrow(() -> new NoSuchElementException("Profissional com ID " + dto.getProfissionalId() + " não encontrado"));

        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new IllegalArgumentException("Este agendamento já está cancelado.");
        }

        boolean temPendente = agendamento.getSolicitacoes().stream()
            .anyMatch(s -> s.getStatus() == StatusSolicitacao.PENDENTE);
        
        if (temPendente) {
            throw new IllegalArgumentException("Este agendamento já possui uma solicitação pendente.");
        }

        boolean conflito = agendamentoRepository.existsByProfissionalIdUsuarioAndDataHoraAndStatusNot(
            profissional.getIdUsuario(),
            dto.getNovaDataHora(),
            StatusAgendamento.CANCELADO 
        );

        if (conflito) {
            throw new IllegalArgumentException("Horário indisponível para reagendamento com o profissional " + profissional.getNome());
        }

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