package com.clinicaestetica.schedule.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Cliente extends Usuario {
    @OneToMany(mappedBy = "cliente")
    @JsonManagedReference(value = "cliente-agendamentos")
    private List<Agendamento> agendamentos = new ArrayList<>();

    public Cliente() {
        super();
    }

    public Cliente(String nome, String cpf, LocalDate data_nascimento, String email, String senha,
            String telefone, String cep, String complemento, String bairro, String cidade, String estado) {
        super(nome, cpf, data_nascimento, email, senha, telefone, cep, complemento, bairro, cidade, estado);
    }

    public List<Agendamento> getAgendamentos() {
        return agendamentos;
    }
    public void setAgendamentos(List<Agendamento> agendamentos) {
        this.agendamentos = agendamentos;
    }
}
    