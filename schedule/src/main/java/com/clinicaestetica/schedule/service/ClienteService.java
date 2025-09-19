package com.clinicaestetica.schedule.service;

import java.util.List;
import java.util.NoSuchElementException; // Importar
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

    public Cliente getCliente(Long id) { // Alterado para retornar Cliente diretamente
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente com ID " + id + " não encontrado"));
    }

    public List<Agendamento> getAgendamentosDoCliente(Long id) { // Alterado para retornar List<Agendamento> diretamente
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cliente com ID " + id + " não encontrado"));
        return cliente.getAgendamentos();
    }

}
