
package com.clinicaestetica.schedule.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;

@Entity
public class Administrador extends Usuario{

    public Administrador(){

    }

    public Administrador(String nome, String cpf, LocalDate data_nascimento, String email, String senha,
            String telefone, String cep, String complemento, String bairro, String cidade, String estado)
            {
        super(nome, cpf, data_nascimento, email, senha, telefone, cep, complemento, bairro, cidade, estado);
    }

     
}