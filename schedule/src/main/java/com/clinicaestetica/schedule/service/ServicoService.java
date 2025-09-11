package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.clinicaestetica.schedule.model.Servico;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service

public class ServicoService {
    
    @Autowired
    private ServicoRepository servicoRepository;

    public List<Servico> listarServicos() {
        return servicoRepository.findAll();
    }

    public ResponseEntity<Servico> criarServico(@RequestBody Servico servico) {
        try {
            Servico savedServico = servicoRepository.save(servico);
            return ResponseEntity.ok(savedServico);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    public Optional<Servico> getServico(Long id) {
         return servicoRepository.findById(id);
    }

    public void deletarServico(Long id) {
        servicoRepository.deleteById(id);
    }
}
