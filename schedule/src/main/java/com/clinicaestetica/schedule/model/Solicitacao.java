package com.clinicaestetica.schedule.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDateTime;
import com.clinicaestetica.schedule.enums.StatusSolicitacao;
import com.clinicaestetica.schedule.enums.TipoSolicitacao; // Adicionei a importação para ser mais claro

@Entity
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private TipoSolicitacao tipo; // Usando a enum que definimos
    
    private String descricao;
    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusSolicitacao status; // Ex: PENDENTE, APROVADA, RECUSADA
    @NotNull
    private LocalDateTime dataCriacao;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "agendamento_id", nullable = false)
    private Agendamento agendamento;
    @NotNull
    @ManyToOne
    @JoinColumn(name = "profissional_id", nullable = false)
    private Profissional profissional; // O atributo para a relação com Profissional

    public Solicitacao() {
    }

    // Construtor completo
    public Solicitacao(TipoSolicitacao tipo, String descricao, StatusSolicitacao status, Agendamento agendamento, Profissional profissional, LocalDateTime dataCriacao) {
        this.tipo = tipo;
        this.descricao = descricao;
        this.status = status;
        this.agendamento = agendamento;
        this.profissional = profissional;
        this.dataCriacao = LocalDateTime.now(); // Define a data de criação como o momento atual
    }
    
    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoSolicitacaoAgendamento getTipo() {
        return tipo;
    }

    public void setTipo(TipoSolicitacaoAgendamento tipo) {
        this.tipo = tipo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public StatusSolicitacao getStatus() {
        return status;
    }

    public void setStatus(StatusSolicitacao status) {
        this.status = status;
    }

    public Agendamento getAgendamento() {
        return agendamento;
    }

    public void setAgendamento(Agendamento agendamento) {
        this.agendamento = agendamento;
    }

    public Profissional getProfissional() {
        return profissional;
    }

    public void setProfissional(Profissional profissional) {
        this.profissional = profissional;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}