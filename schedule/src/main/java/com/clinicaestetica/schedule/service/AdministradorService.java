package com.clinicaestetica.schedule.service;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.repository.SolicitacaoRepository;

@Service
public class AdministradorService {

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    public Profissional criarProfissional(Profissional profissional) {
        return profissionalRepository.save(profissional);
    }
    
    public Profissional deletarProfissional(Long id){ 
        Profissional profissional = profissionalRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Profissional com id " + id + " não encontrado"));

        profissionalRepository.deleteById(id);

        return profissional;
    }

    public Profissional atualizarProfissional(Long id, Profissional profissionalAtualizado) {
        Profissional profissionalExistente = profissionalRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Profissional com id " + id + " não encontrado"));

        // Atualizar informações pessoais editáveis
        if (profissionalAtualizado.getNome() != null) {
            profissionalExistente.setNome(profissionalAtualizado.getNome());
        }
        if (profissionalAtualizado.getEmail() != null) {
            profissionalExistente.setEmail(profissionalAtualizado.getEmail());
        }
        if (profissionalAtualizado.getTelefone() != null) {
            profissionalExistente.setTelefone(profissionalAtualizado.getTelefone());
        }

        // Atualizar endereço completo
        if (profissionalAtualizado.getCep() != null) {
            profissionalExistente.setCep(profissionalAtualizado.getCep());
        }
        if (profissionalAtualizado.getComplemento() != null) {
            profissionalExistente.setComplemento(profissionalAtualizado.getComplemento());
        }
        if (profissionalAtualizado.getBairro() != null) {
            profissionalExistente.setBairro(profissionalAtualizado.getBairro());
        }
        if (profissionalAtualizado.getCidade() != null) {
            profissionalExistente.setCidade(profissionalAtualizado.getCidade());
        }
        if (profissionalAtualizado.getEstado() != null) {
            profissionalExistente.setEstado(profissionalAtualizado.getEstado());
        }

        return profissionalRepository.save(profissionalExistente);
    }

    public Agendamento deletarAgendamento(Long id){ // com as solicitações dos profissionais
        Agendamento agendamento = agendamentoRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("Agendamento com id " + id + " não encontrado"));
        agendamentoRepository.deleteById(id);

        return agendamento;
    }

    public List<Solicitacao> listarSolicitacoes(){
        return solicitacaoRepository.findAll();
    }

    public List<Profissional> listarProfissionais() {
        return profissionalRepository.findAll();
    }

    
}
