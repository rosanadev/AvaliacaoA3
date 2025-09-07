package com.clinicaestetica.schedule.model;
import java.time.LocalDate;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Profissional extends Usuario {

    private String registroProfissional; //carteira do profissional

    @ManyToOne
    @JoinColumn (name = "idEspecialidade", nullable =  false)
    private Especialidade especialidade;

    public Profissional(String nome, String cpf, LocalDate data_nascimento, String email, String senha, String telefone,
            String cep, String complemento, String bairro, String cidade, String estado, String carteira, String registroProfissional,
            Especialidade especialidade) {
        super(nome, cpf, data_nascimento, email, senha, telefone, cep, complemento, bairro, cidade, estado);
        this.registroProfissional = registroProfissional;
        this.especialidade = especialidade;
    }

    public String getRegistroProfissional() {
        return registroProfissional;
    }

    public void setRegistroProfissional(String registroProfissional) {
        this.registroProfissional = registroProfissional;
    }

    public Especialidade getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(Especialidade especialidade) {
        this.especialidade = especialidade;
    }

    

    
    
}
