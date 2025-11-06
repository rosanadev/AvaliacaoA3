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
import java.util.List;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    public Solicitacao criarSolicitacao(Solicitacao solicitacao) {
        // Lógica de negócio para a solicitação (se houver)
        return solicitacaoRepository.save(solicitacao);
    }

    public List<Solicitacao> listarSolicitacoes() {
        return solicitacaoRepository.findAll();
    }
}