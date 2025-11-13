package com.clinicaestetica.schedule.service;
import com.clinicaestetica.schedule.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Servico;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors; 

@Service

public class ServicoService {
    
    @Autowired
    private ServicoRepository servicoRepository;

    public List<Servico> listarServicos() {
        return servicoRepository.findAll();
    }

    public List<Profissional> getProfissionaisPorServico(Long id) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Serviço com ID " + id + " não encontrado"));

        return servico.getEspecialidades().stream()
                .flatMap(especialidade -> especialidade.getProfissionais().stream())
                .distinct() // Remove duplicatas
                .collect(Collectors.toList()); // ✅ Retorna List ao invés de Set
    }

    public Servico criarServico(Servico servico) {
        return servicoRepository.save(servico);
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
