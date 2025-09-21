package com.clinicaestetica.schedule.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.service.ClienteService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @Autowired

    private ClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        List<Cliente> clientes = clienteService.listarClientes();
        return new ResponseEntity<>(clientes, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Cliente> cadastrarCliente(@Valid @RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.cadastrarCliente(cliente);
        return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Cliente> getCliente(@PathVariable Long id) {
        // Agora o service lança a exceção, o ControllerAdvice a captura
        Cliente cliente = clienteService.getCliente(id);
        return new ResponseEntity<>(cliente, HttpStatus.OK);
    }
    @GetMapping("/{id}/agendamentos")
    public ResponseEntity<List<Agendamento>> getAgendamentosDoCliente(@PathVariable Long id) {
        // Agora o service lança a exceção, o ControllerAdvice a captura
        List<Agendamento> agendamentos = clienteService.getAgendamentosDoCliente(id);
        return new ResponseEntity<>(agendamentos, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<Cliente> login(@RequestBody Cliente cliente) {
    Optional<Cliente> clienteOptional = clienteService.login(cliente.getEmail(), cliente.getSenha());
    
        if (clienteOptional.isPresent()) {
            return new ResponseEntity<>(clienteOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
