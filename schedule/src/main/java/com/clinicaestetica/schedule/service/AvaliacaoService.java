package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.model.Avaliacao;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.NoSuchElementException;


@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public Avaliacao criarAvaliacao(Long agendamentoId, Avaliacao avaliacao) {
        // Encontra o agendamento pelo ID
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                    .orElseThrow(() -> new NoSuchElementException("Agendamento não encontrado"));

         // Verificar se o status do agendamento é CONCLUIDO
        if (agendamento.getStatus() != StatusAgendamento.CONCLUÍDO) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Não é possível avaliar um agendamento que não esteja concluído.");
        }
        
        // Associar o agendamento à avaliação e salvar
        avaliacao.setAgendamento(agendamento);
        return avaliacaoRepository.save(avaliacao);
        }
    }
