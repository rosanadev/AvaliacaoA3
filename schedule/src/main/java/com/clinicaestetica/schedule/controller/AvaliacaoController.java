package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Avaliacao;
import com.clinicaestetica.schedule.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping("/{agendamentoId}") // Recebe o ID do agendamento na URL
    public ResponseEntity<Avaliacao> criarAvaliacao(@PathVariable Long agendamentoId, @Valid @RequestBody Avaliacao avaliacao) {
        Avaliacao novaAvaliacao = avaliacaoService.criarAvaliacao(agendamentoId, avaliacao);
        return new ResponseEntity<>(novaAvaliacao, HttpStatus.CREATED);
    }
}