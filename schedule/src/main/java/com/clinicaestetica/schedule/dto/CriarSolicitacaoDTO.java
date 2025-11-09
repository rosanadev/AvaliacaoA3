package com.clinicaestetica.schedule.dto;
import com.clinicaestetica.schedule.enums.TipoSolicitacaoAgendamento;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CriarSolicitacaoDTO {
    
    @NotNull(message = "O ID do agendamento é obrigatório")
    private Long agendamentoId;
    
    @NotNull(message = "O ID do profissional é obrigatório")
    private Long profissionalId;
    
    @NotBlank(message = "A descrição não pode estar em branco")
    @Size(max = 500, message = "A descrição não pode exceder 500 caracteres")
    private String descricao;
    
    @NotNull(message = "O tipo de solicitação é obrigatório")
    private TipoSolicitacaoAgendamento tipo;

    // Construtor vazio
    public CriarSolicitacaoDTO() {
    }

    // Construtor completo
    public CriarSolicitacaoDTO(Long agendamentoId, Long profissionalId, String descricao, TipoSolicitacaoAgendamento tipo) {
        this.agendamentoId = agendamentoId;
        this.profissionalId = profissionalId;
        this.descricao = descricao;
        this.tipo = tipo;
    }

    // Getters e Setters
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

    public TipoSolicitacaoAgendamento getTipo() {
        return tipo;
    }

    public void setTipo(TipoSolicitacaoAgendamento tipo) {
        this.tipo = tipo;
    }
}