package com.clinicaestetica.schedule.dto;

import com.clinicaestetica.schedule.enums.TipoSolicitacaoAgendamento;
import com.clinicaestetica.schedule.model.Solicitacao;

public class CriarSolicitacaoDTO {
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