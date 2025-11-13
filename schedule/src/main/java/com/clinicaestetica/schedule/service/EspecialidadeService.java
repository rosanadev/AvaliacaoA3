package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Especialidade;
import com.clinicaestetica.schedule.repository.EspecialidadeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EspecialidadeService {

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    public Especialidade criarEspecialidade(Especialidade especialidade) {

        return especialidadeRepository.save(especialidade);
    }

    public List<Especialidade> listarEspecialidades() {
        return especialidadeRepository.findAll();
    }
}