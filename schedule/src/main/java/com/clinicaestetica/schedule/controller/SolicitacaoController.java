package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.service.SolicitacaoService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listarSolicitacoes () {
        List<Solicitacao> solicitacoes = solicitacaoService.listarSolicitacoes();
        return new ResponseEntity<>(solicitacoes, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Solicitacao> criarSolicitacao(@Valid @RequestBody Solicitacao solicitacao) {
        Solicitacao novaSolicitacao = solicitacaoService.criarSolicitacao(solicitacao);
        return new ResponseEntity<>(novaSolicitacao, HttpStatus.CREATED);
    }
}