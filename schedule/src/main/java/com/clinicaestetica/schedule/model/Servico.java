package com.clinicaestetica.schedule.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
public class Servico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "O nome do serviço não pode estar em branco")
    @Size(min = 3, max = 100, message = "O nome do serviço deve ter entre 3 e 100 caracteres")
    private String nome;
    @NotBlank(message = "A descrição do serviço não pode estar em branco")
    @Size(max = 500, message = "A descrição do serviço não pode exceder 500 caracteres")
    private String descricao;
    @NotNull(message = "O preço do serviço não pode ser nulo")
    @DecimalMin(value = "0.01", message = "O preço do serviço deve ser maior que zero")
    private BigDecimal preco;
    @Min(value = 1, message = "A duração do serviço deve ser de no mínimo 1 minuto")
    private int duracao_em_minutos;
    @OneToMany(mappedBy = "servico")
    private List<Agendamento> agendamentos = new ArrayList<>();
    @JsonIgnore
    @ManyToMany(mappedBy = "servicos")
    private Set<Especialidade> especialidades = new HashSet<>();
    
    public Servico(){ //Construtor vazio (obrigatório para a JPA)

    }

    public Servico(String nome, String descricao, BigDecimal preco, int duracao_em_minutos){
        this.nome = nome;
        this.descricao = descricao;
        this.preco = preco;
        this.duracao_em_minutos = duracao_em_minutos;

    } 

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

    public Set<Especialidade> getEspecialidades() {
        return especialidades;
    }
    
    public void setEspecialidades(Set<Especialidade> especialidades) {
        this.especialidades = especialidades;
    }

}

