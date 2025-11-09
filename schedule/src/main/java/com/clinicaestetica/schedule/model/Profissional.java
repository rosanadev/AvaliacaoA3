package com.clinicaestetica.schedule.model;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Profissional extends Usuario {

    private String registroProfissional; //carteira do profissional

    @ManyToMany
    @JoinTable(
        name = "profissional_especialidade", // Nome da tabela de junção
        joinColumns = @JoinColumn(name = "profissional_id"), // Chave estrangeira do Profissional
        inverseJoinColumns = @JoinColumn(name = "especialidade_id") // Chave estrangeira da Especialidade
    )
    private Set<Especialidade> especialidades = new HashSet<>(); // Use Set para manter a consistência

    @OneToMany(mappedBy = "profissional")
    @JsonManagedReference(value = "profissional-agendamentos")
    private Set<Agendamento> agendamentos = new HashSet<>();

    @OneToMany(mappedBy = "profissional")
    private Set<Solicitacao> solicitacoes = new HashSet<>();

    // construtor vazio para JPA
    public Profissional() {
        super();
    }

    public Profissional(String nome, String cpf, LocalDate data_nascimento, String email, String senha, String telefone,
            String cep, String complemento, String bairro, String cidade, String estado, String carteira, String registroProfissional) {
        super(nome, cpf, data_nascimento, email, senha, telefone, cep, complemento, bairro, cidade, estado);
        this.registroProfissional = registroProfissional;
    }

    public String getRegistroProfissional() {
        return registroProfissional;
    }

    public void setRegistroProfissional(String registroProfissional) {
        this.registroProfissional = registroProfissional;
    }

    public Set<Especialidade> getEspecialidades() {
        return especialidades;
    }

    public void setEspecialidades(Set<Especialidade> especialidades) {
        this.especialidades = especialidades;
    }
    public Set<Agendamento> getAgendamentos() {
        return agendamentos;
    }
    public void setAgendamentos(Set<Agendamento> agendamentos) {
        this.agendamentos = agendamentos;
    }
    public Set<Solicitacao> getSolicitacoes() {
        return solicitacoes;
    }
    public void setSolicitacoes(Set<Solicitacao> solicitacoes) {
        this.solicitacoes = solicitacoes;
    }
}
