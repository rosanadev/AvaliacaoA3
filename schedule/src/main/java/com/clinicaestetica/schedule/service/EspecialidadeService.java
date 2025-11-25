package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Especialidade;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.repository.EspecialidadeRepository;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EspecialidadeService {

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    public Especialidade criarEspecialidade(Especialidade especialidade) {
        return especialidadeRepository.save(especialidade);
    }

    public List<Especialidade> listarEspecialidades() {
        return especialidadeRepository.findAll();
    }

    public Especialidade buscarPorId(Long id) {
        return especialidadeRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Especialidade não encontrada"));
    }

    public Especialidade atualizarEspecialidade(Long id, Especialidade especialidadeAtualizada) {
        Especialidade especialidade = buscarPorId(id);
        
        if (especialidadeAtualizada.getNome() != null) {
            especialidade.setNome(especialidadeAtualizada.getNome());
        }
        if (especialidadeAtualizada.getDescricao() != null) {
            especialidade.setDescricao(especialidadeAtualizada.getDescricao());
        }
        
        return especialidadeRepository.save(especialidade);
    }

    public void deletarEspecialidade(Long id) {
        Especialidade especialidade = buscarPorId(id);
        
        // Verificar se há profissionais ou serviços associados
        if (!especialidade.getProfissionais().isEmpty()) {
            throw new IllegalStateException("Não é possível excluir especialidade com profissionais associados");
        }
        if (!especialidade.getServicos().isEmpty()) {
            throw new IllegalStateException("Não é possível excluir especialidade com serviços associados");
        }
        
        especialidadeRepository.deleteById(id);
    }

    @Transactional
    public Especialidade associarServico(Long especialidadeId, Long servicoId) {
        Especialidade especialidade = buscarPorId(especialidadeId);
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new NoSuchElementException("Serviço não encontrado"));

        if (!especialidade.getServicos().contains(servico)) {
            especialidade.getServicos().add(servico);
            servico.getEspecialidades().add(especialidade);
        }
        
        return especialidadeRepository.save(especialidade);
    }

    @Transactional
    public Especialidade desassociarServico(Long especialidadeId, Long servicoId) {
        Especialidade especialidade = buscarPorId(especialidadeId);
        Servico servico = servicoRepository.findById(servicoId)
                .orElseThrow(() -> new NoSuchElementException("Serviço não encontrado"));

        especialidade.getServicos().remove(servico);
        servico.getEspecialidades().remove(especialidade);
        
        return especialidadeRepository.save(especialidade);
    }

    @Transactional
    public Profissional associarProfissional(Long especialidadeId, Long profissionalId) {
        Especialidade especialidade = buscarPorId(especialidadeId);
        Profissional profissional = profissionalRepository.findById(profissionalId)
                .orElseThrow(() -> new NoSuchElementException("Profissional não encontrado"));

        if (!profissional.getEspecialidades().contains(especialidade)) {
            profissional.getEspecialidades().add(especialidade);
            especialidade.getProfissionais().add(profissional);
        }
        
        return profissionalRepository.save(profissional);
    }

    @Transactional
    public Profissional desassociarProfissional(Long especialidadeId, Long profissionalId) {
        Especialidade especialidade = buscarPorId(especialidadeId);
        Profissional profissional = profissionalRepository.findById(profissionalId)
                .orElseThrow(() -> new NoSuchElementException("Profissional não encontrado"));

        profissional.getEspecialidades().remove(especialidade);
        especialidade.getProfissionais().remove(profissional);
        
        return profissionalRepository.save(profissional);
    }
}