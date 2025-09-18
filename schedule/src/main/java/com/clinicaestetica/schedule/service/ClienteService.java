package com.clinicaestetica.schedule.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.repository.ClienteRepository;
import com.clinicaestetica.schedule.model.Agendamento;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

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

    public Optional<Cliente> getCliente(Long id) {
        return clienteRepository.findById(id);
    }

    public Optional<List<Agendamento>> getAgendamentosDoCliente(Long id) {
        Optional<Cliente> clienteOptional = clienteRepository.findById(id);

        return clienteOptional.map(Cliente::getAgendamentos);
    }

}
