package com.clinicaestetica.schedule.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;

@Service
class ProfisisonalService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    public Optional<Profissional>login(String email, String senha){
    Optional<Profissional> profissionalOptional = profissionalRepository.findByEmail(email);

    if (profissionalOptional.isPresent() && profissionalOptional.get().getSenha().equals(senha)) {
        return profissionalOptional;
    }
    return Optional.empty();
    }


    
}