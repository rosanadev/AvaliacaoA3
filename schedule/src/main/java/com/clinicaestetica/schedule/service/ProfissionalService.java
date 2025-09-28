package com.clinicaestetica.schedule.service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;

import com.clinicaestetica.schedule.model.Agendamento;

@Service
public class ProfissionalService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    public Optional<Profissional>login(String email, String senha){
    Optional<Profissional> profissionalOptional = profissionalRepository.findByEmail(email);

    if (profissionalOptional.isPresent() && profissionalOptional.get().getSenha().equals(senha)) {
        return profissionalOptional;
    }
    return Optional.empty();
    }

    public Profissional getProfissional(long id) {
        return profissionalRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("Profissional com id " + id +" não encontrado"));
    }

    public Long obterIdProfissionalLogado() {
        List<Profissional> profissionais = profissionalRepository.findAll();
        if (!profissionais.isEmpty()) {
            return profissionais.get(0).getIdUsuario(); // ← Pega o ID do primeiro profissional
        }
        throw new NoSuchElementException("Nenhum profissional cadastrado no sistema");
    }

    public Set<Agendamento> getAgendamentosDoProfissional(long id) {
        Profissional profissional = profissionalRepository.findById(id)
        .orElseThrow(() -> new NoSuchElementException("Profissional com id " + id + " não encontrado"));
        return profissional.getAgendamentos();
    }


    
}