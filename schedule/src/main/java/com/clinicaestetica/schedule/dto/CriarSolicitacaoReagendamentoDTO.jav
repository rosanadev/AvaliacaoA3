package com.clinicaestetica.schedule.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public class CriarSolicitacaoReagendamentoDTO {
    
    @NotNull(message = "O ID do agendamento é obrigatório")
    private Long agendamentoId;
    
    @NotNull(message = "O ID do profissional é obrigatório")
    private Long profissionalId;
    
    @NotBlank(message = "A descrição não pode estar em branco")
    @Size(max = 500, message = "A descrição não pode exceder 500 caracteres")
    private String descricao;
    
    @NotNull(message = "A nova data e hora são obrigatórias para reagendamento")
    private LocalDateTime novaDataHora;

    public CriarSolicitacaoReagendamentoDTO() {
    }

    public CriarSolicitacaoReagendamentoDTO(Long agendamentoId, Long profissionalId, String descricao, LocalDateTime novaDataHora) {
        this.agendamentoId = agendamentoId;
        this.profissionalId = profissionalId;
        this.descricao = descricao;
        this.novaDataHora = novaDataHora;
    }
    
    public Long getAgendamentoId() {
        return agendamentoId;
    }

    public void setAgendamentoId(Long agendamentoId) {
        this.agendamentoId = agendamentoId;
    }

    public Long getProfissionalId() {
        return profissionalId;
    }

    public void setProfissionalId(Long profissionalId) {
        this.profissionalId = profissionalId;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getNovaDataHora() {
        return novaDataHora;
    }

    public void setNovaDataHora(LocalDateTime novaDataHora) {
        this.novaDataHora = novaDataHora;
    }
}