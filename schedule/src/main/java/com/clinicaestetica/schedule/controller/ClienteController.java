package com.clinicaestetica.schedule.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.service.ClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {
    @Autowired

    private ClienteService clienteService;

    @PostMapping
    public ResponseEntity<Cliente> cadastrarCliente(@RequestBody Cliente cliente) {
        Cliente novoCliente = clienteService.cadastrarCliente(cliente);
        return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
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
