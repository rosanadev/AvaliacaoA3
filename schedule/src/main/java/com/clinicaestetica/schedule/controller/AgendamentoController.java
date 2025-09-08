package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.service.AgendamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/agendamentos")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @PostMapping
    public ResponseEntity<Agendamento> agendarServico(@RequestBody Agendamento agendamento) {
        Agendamento novoAgendamento = agendamentoService.agendarServico(agendamento);
        return new ResponseEntity<>(novoAgendamento, HttpStatus.CREATED);
    }
}