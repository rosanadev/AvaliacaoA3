package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.service.SolicitacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService solicitacaoService;

    @PostMapping
    public ResponseEntity<Solicitacao> criarSolicitacao(@RequestBody Solicitacao solicitacao) {
        Solicitacao novaSolicitacao = solicitacaoService.criarSolicitacao(solicitacao);
        return new ResponseEntity<>(novaSolicitacao, HttpStatus.CREATED);
    }
}