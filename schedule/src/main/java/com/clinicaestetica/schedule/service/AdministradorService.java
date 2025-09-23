package com.clinicaestetica.schedule.service;

import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;

@Service
public class AdministradorService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired

    public Profissional criarProfissional(Profissional profissional) {
        return profissionalRepository.save(profissional);
    }
    
    public Profissional deletarProfissional(Long id){
        Profissional profissional = profissionalRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Profissional com id " + id + " não encontrado"));

        profissionalRepository.deleteById(id);

        return profissional;
    }

    public Agendamento deletarAgendamento(Long id){
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Agendamento com id " + id + " não encontrado"));
        agendamentoRepository.deleteById(id);

        return agendamento;
    }
}
