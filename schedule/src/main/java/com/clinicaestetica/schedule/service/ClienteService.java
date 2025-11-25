package com.clinicaestetica.schedule.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.repository.ClienteRepository;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private AgendamentoRepository agendamentoRepository;

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public Cliente cadastrarCliente (Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Optional<Cliente> login(String email, String senha) {
    Optional<Cliente> clienteOptional = clienteRepository.findByEmail(email);

    if (clienteOptional.isPresent() && clienteOptional.get().getSenha().equals(senha)) {
        return clienteOptional;
    }
    return Optional.empty();
    }

    public Cliente getCliente(Long id) { 
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente com ID " + id + " não encontrado"));
    }

    public List<Agendamento> getAgendamentosDoCliente(Long id) { 
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente com ID " + id + " não encontrado"));
        return cliente.getAgendamentos();
    }

    public List<Agendamento> getAgendamentosFuturos(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente com ID " + id + " não encontrado"));
        return agendamentoRepository.findAgendamentosFuturos(
            id, 
            LocalDateTime.now(),
            StatusAgendamento.AGENDADO,
            StatusAgendamento.ALTERADO
        );
    }

    public List<Agendamento> getAgendamentosPassados(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente com ID " + id + " não encontrado"));
        return agendamentoRepository.findAgendamentosPassados(
            id, 
            LocalDateTime.now(),
            StatusAgendamento.CONCLUÍDO,
            StatusAgendamento.CANCELADO
        );
    }
}