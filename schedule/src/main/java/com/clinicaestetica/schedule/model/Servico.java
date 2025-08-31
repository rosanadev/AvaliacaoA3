package com.clinicaestetica.schedule.model;

import java.math.BigDecimal;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;
    private BigDecimal preco;
    private int duracaoEmMinutos;

    public Servico(){ //Construtor vazio (obrigatório para a JPA)

    }

    public Servico(String nomeString, String descricaoString, BigDecimal precoBigDecimal, int duracaoEmMinutosInt){
        this.nome = nomeString;
        this.descricao = descricaoString;
        this.preco = precoBigDecimal;
        this.duracaoEmMinutos = duracaoEmMinutosInt;

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
        return duracaoEmMinutos;
    }

    public void setDuracaoEmMinutos (int duracaoEmMinutos) {
        this.duracaoEmMinutos = duracaoEmMinutos;
    }

}

