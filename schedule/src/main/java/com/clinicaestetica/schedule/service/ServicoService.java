package com.clinicaestetica.schedule.service;
import com.clinicaestetica.schedule.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import com.clinicaestetica.schedule.model.Servico;
import java.util.List;
import java.util.NoSuchElementException; 

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
            // Em um cenário real, você pode querer logar a exceção ou lançar uma exceção mais específica
            return ResponseEntity.badRequest().build();
        }
    }

    public Servico getServico(Long id) { // Alterado para retornar Servico diretamente
         return servicoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Serviço com ID " + id + " não encontrado"));
    }

    public void deletarServico(Long id) {
        if (!servicoRepository.existsById(id)) {
            throw new NoSuchElementException("Serviço com ID " + id + " não encontrado para exclusão");
        }
        servicoRepository.deleteById(id);
    }
}
