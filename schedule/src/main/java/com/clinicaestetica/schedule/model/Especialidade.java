package com.clinicaestetica.schedule.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class Especialidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEspecialidade;
    private String nome;
    private String descricao;

    @ManyToMany(mappedBy = "especialidades")
    @JsonIgnore
    private List<Profissional> profissionais = new ArrayList<>();
    
    @ManyToMany
    @JoinTable(
        name = "servico_especialidade", // Tabela de junção
        joinColumns = @JoinColumn(name = "especialidade_id"), // FK de Especialidade
        inverseJoinColumns = @JoinColumn(name = "servico_id") // FK de Servico
    )
    @JsonIgnore
    private Set<Servico> servicos = new HashSet<>();


    public Especialidade() {} 

    public Especialidade(String nome, String descricao) {
        this.nome = nome;
        this.descricao = descricao;
    }

    public Long getIdEspecialidade() {
        return idEspecialidade;
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
    public List<Profissional> getProfissionais() {
        return profissionais;
    }
    public void setProfissionais(List<Profissional> profissionais) {
        this.profissionais = profissionais;
    }
    public Set<Servico> getServicos() {
        return servicos;
    }
    public void setServicos(Set<Servico> servicos) {
        this.servicos = servicos;
    }
}
