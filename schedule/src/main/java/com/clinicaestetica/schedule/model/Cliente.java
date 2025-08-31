package com.clinicaestetica.schedule.model;

import java.time.LocalDate;
import jakarta.persistence.Entity;

@Entity
public class Cliente extends Usuario {
    
    //private String categoria; //Tipos de clientes, esse campo pode ser tabelado no banco de dados 

    public Cliente() {

    }

    public Cliente(String nome, String cpf, LocalDate data_nascimento, String email, String senha,
            String telefone, String cep, String complemento, String bairro, String cidade, String estado)
            //String categoria) 
            {
        super(nome, cpf, data_nascimento, email, senha, telefone, cep, complemento, bairro, cidade, estado);
        //this.categoria = categoria;
    }

    // Getters e Setters

    //public String getCategoria() {
    //    return categoria;
    //}

    //public void setCategoria(String categoria) {
    //    this.categoria = categoria;
    //}
}
    