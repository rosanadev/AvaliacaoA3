package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.enums.TipoSolicitacaoAgendamento;
import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.service.SolicitacaoService;
import jakarta.validation.Valid;
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
    public ResponseEntity<Solicitacao> criarSolicitacao(@Valid @RequestBody CriarSolicitacaoRequest request) {
        Solicitacao novaSolicitacao = solicitacaoService.criarSolicitacaoAgendamento(
            request.getSolicitacao(),
            request.getAgendamentoId(),
            request.getDescricao(),
            request.getTipo()
        );
        return new ResponseEntity<>(novaSolicitacao, HttpStatus.CREATED);
    }

    // Classe interna para o DTO do request
    public static class CriarSolicitacaoRequest {
        private Solicitacao solicitacao;
        private Long agendamentoId;
        private String descricao;
        private TipoSolicitacaoAgendamento tipo;

        // getters e setters
        public Solicitacao getSolicitacao() {
            return solicitacao;
        }

        public void setSolicitacao(Solicitacao solicitacao) {
            this.solicitacao = solicitacao;
        }

        public Long getAgendamentoId() {
            return agendamentoId;
        }

        public void setAgendamentoId(Long agendamentoId) {
            this.agendamentoId = agendamentoId;
        }

        public String getDescricao() {
            return descricao;
        }

        public void setDescricao(String descricao) {
            this.descricao = descricao;
        }
        public TipoSolicitacaoAgendamento getTipo() {
            return tipo;
        }

        public void setTipo(TipoSolicitacaoAgendamento tipo) {
            this.tipo = tipo;
        }
    }
}