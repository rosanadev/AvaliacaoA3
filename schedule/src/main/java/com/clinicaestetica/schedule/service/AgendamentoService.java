package com.clinicaestetica.schedule.service;

import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinicaestetica.schedule.repository.ClienteRepository;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.repository.ServicoRepository;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    public List<Agendamento> listarAgendamentos() {
        return agendamentoRepository.findAll();
    }

    public Agendamento agendarServico(Agendamento agendamento) {
        if (agendamento.getCliente().getIdUsuario() == null) {
            throw new RuntimeException("Cliente não encontrado.");
        }

        Cliente cliente = clienteRepository.findById(agendamento.getCliente().getIdUsuario())
        .orElseThrow(() -> new RuntimeException("Cliente não encontrado."));

        Profissional profissional = profissionalRepository.findById(agendamento.getProfissional().getIdUsuario())
        .orElseThrow(() -> new RuntimeException("Profissional não encontrado."));

        Servico servico = servicoRepository.findById(agendamento.getServico().getId())
        .orElseThrow(() -> new RuntimeException("Serviço não encontrado."));

        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);


        return agendamentoRepository.save(agendamento);
    }

    public boolean cancelarAgendamento(Long id) {
        if (agendamentoRepository.existsById(id)) {
            agendamentoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Agendamento> getAgendamento(Long id) {
        return agendamentoRepository.findById(id);
    }
}