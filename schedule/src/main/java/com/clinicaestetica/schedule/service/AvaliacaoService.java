package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Avaliacao;
import com.clinicaestetica.schedule.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    public Avaliacao criarAvaliacao(Avaliacao avaliacao) {
        // Lógica de negócio para a avaliação (se houver)
        return avaliacaoRepository.save(avaliacao);
    }
}