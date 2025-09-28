package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.repository.SolicitacaoRepository;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.enums.StatusSolicitacao;
import com.clinicaestetica.schedule.enums.TipoSolicitacaoAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.model.Profissional;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private ProfissionalService profissionalService;

    public Solicitacao criarSolicitacaoAgendamento(Solicitacao solicitacao, Long agendamentoId, String descricao, TipoSolicitacaoAgendamento tipo) {
        
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
            .orElseThrow(() -> new NoSuchElementException("Agendamento " + agendamentoId + " não encontrado"));
        
        Long profissionalId = profissionalService.obterIdProfissionalLogado();
        Profissional profissional = profissionalRepository.findById(profissionalId)
            .orElseThrow(() -> new NoSuchElementException ("Erro ao encontrar seu id, tente novamente"));

        solicitacao.setAgendamento(agendamento);
        solicitacao.setProfissional(profissional);
        solicitacao.setDescricao(descricao);
        solicitacao.setDataCriacao(LocalDateTime.now());
        solicitacao.setTipo(tipo);
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);

        return solicitacaoRepository.save(solicitacao);
    }
}