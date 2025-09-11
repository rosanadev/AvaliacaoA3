package com.clinicaestetica.schedule.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private int duracao_em_minutos;
    @OneToMany(mappedBy = "servico")
    private List<Agendamento> agendamentos = new ArrayList<>();
    @ManyToMany(mappedBy = "servicos")
    private Set<Especialidade> especialidades = new HashSet<>();

    public Servico(){ //Construtor vazio (obrigatório para a JPA)

    }

    public Servico(String nome, String descricao, BigDecimal preco, int duracao_em_minutos){
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.duracao_em_minutos = duracao_em_minutos;

    } // O ID não faz parte do construtor porque ele é gerado automaticamente pelo database

    //Getters e setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public int getDuracaoEmMinutos() {
        return duracao_em_minutos;
    }

    public void setDuracaoEmMinutos (int duracao_em_minutos) {
        this.duracao_em_minutos = duracao_em_minutos;
    }

}

