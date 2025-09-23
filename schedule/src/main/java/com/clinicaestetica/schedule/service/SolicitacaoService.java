package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.repository.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    public Solicitacao criarSolicitacao(Solicitacao solicitacao) {
        return solicitacaoRepository.save(solicitacao);
    }
}