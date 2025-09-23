package com.clinicaestetica.schedule.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.Set;

import com.clinicaestetica.schedule.enums.StatusAgendamento;

@Entity
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAgendamento;
    private LocalDateTime dataHora;
    private StatusAgendamento status;
    private LocalDateTime dataCancelamento;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonBackReference(value = "cliente-agendamentos")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "profissional_id", nullable = false)
    @JsonBackReference(value = "profissional-agendamentos")
    private Profissional profissional;

    @ManyToOne
    @JoinColumn(name = "servico_id", nullable = false)
    private Servico servico;

    @ManyToMany
    @JoinTable(
        name = "agendamento_administrador",
        joinColumns = @JoinColumn(name = "agendamento_id"),
        inverseJoinColumns = @JoinColumn(name = "administrador_id")
    )
    private Set<Administrador> administradores;

    @OneToOne(mappedBy = "agendamento")
    private Avaliacao avaliacao;

    @OneToOne(mappedBy = "agendamento")
    private Pagamento pagamento;

    @OneToMany(mappedBy = "agendamento")
    @JsonManagedReference(value = "agendamento-solicitacoes")
    private Set<Solicitacao> solicitacoes;

    // Construtor vazio (obrigatório para JPA)
    public Agendamento() {
    }

    // Construtor com todos os atributos
    public Agendamento(LocalDateTime dataHora, StatusAgendamento status, LocalDateTime dataCancelamento, Cliente cliente, Profissional profissional, Servico servico) {
        this.dataHora = dataHora;
        this.status = status;
        this.dataCancelamento = dataCancelamento;
        this.cliente = cliente;
        this.profissional = profissional;
        this.servico = servico;
    }

    // Getters e Setters

    public Long getId() {
        return idAgendamento;
    }

    public void setId(Long idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public StatusAgendamento getStatus() {
        return status;
    }

    public void setStatus(StatusAgendamento status) {
        this.status = status;
    }

    public LocalDateTime getDataCancelamento() {
        return dataCancelamento;
    }

    public void setDataCancelamento(LocalDateTime dataCancelamento) {
        this.dataCancelamento = dataCancelamento;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Profissional getProfissional() {
        return profissional;
    }

    public void setProfissional(Profissional profissional) {
        this.profissional = profissional;
    }

    public Servico getServico() {   
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public Set<Solicitacao> getSolicitacoes() {
        return solicitacoes;
    }

    public void setSolicitacoes(Set<Solicitacao> solicitacoes) {
        this.solicitacoes = solicitacoes;
    }

}