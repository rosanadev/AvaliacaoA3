package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
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
}