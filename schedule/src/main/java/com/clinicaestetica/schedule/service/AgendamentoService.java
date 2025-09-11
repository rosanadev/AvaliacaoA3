package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public Agendamento agendarServico(Agendamento agendamento) {
        // Implementar a lógica de negócio aqui, como validação de horário
        return agendamentoRepository.save(agendamento);
    }

    public boolean cancelarAgendamento(Long id) {
        if (agendamentoRepository.existsById(id)) {
            agendamentoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Agendamento> getAgendamento(Long id) {
        return agendamentoRepository.findById(id);
    }
}