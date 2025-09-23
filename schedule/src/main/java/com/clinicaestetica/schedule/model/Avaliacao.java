package com.clinicaestetica.schedule.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "A nota é obrigatória")
    @Min(value = 1, message = "A nota mínima é 1") 
    @Max(value = 5, message = "A nota máxima é 5")
    private int nota;

    @NotBlank(message = "O comentário é obrigatório")
    @Size(max = 500, message = "O comentário não pode exceder 500 caracteres")
    private String comentario;
    
    @OneToOne
    @JoinColumn(name = "agendamento_id", nullable = false)
    private Agendamento agendamento;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente; // Adicione este campo

    // Construtor vazio (obrigatório para JPA)
    public Avaliacao() {
    }

    // Construtor com todos os atributos
    public Avaliacao(int nota, String comentario, Agendamento agendamento, Cliente cliente) {
        this.nota = nota;
        this.comentario = comentario;
        this.agendamento = agendamento;
        this.cliente = cliente;
    }

    // Getters e Setters
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public int getNota() {
        return nota;
    }

    public void setNota(int nota) {
        this.nota = nota;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public Agendamento getAgendamento() {
        return agendamento;
    }

    public void setAgendamento(Agendamento agendamento) {
        this.agendamento = agendamento;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

}