package com.clinicaestetica.schedule.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.repository.ClienteRepository;

@Service
public class ClienteService {
    @Autowired
    private ClienteRepository clienteRepository;

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

}
