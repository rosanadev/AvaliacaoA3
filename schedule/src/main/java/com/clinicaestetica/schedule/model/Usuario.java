package com.clinicaestetica.schedule.model;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

@MappedSuperclass
public abstract class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long idUsuario; // Chave primária para o banco de dados, incrementado automaticamente
    @NotBlank(message = "O nome não pode estar em branco")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    protected String nome;
    @NotBlank(message = "O CPF não pode estar em branco")
    @Pattern(regexp = "\\d{11}", message = "O CPF deve conter 11 dígitos numéricos")
    protected String cpf;
    @NotNull(message = "A data de nascimento não pode ser nula")
    @Past(message = "A data de nascimento deve ser no passado")
    protected LocalDate data_nascimento;
    @NotBlank(message = "O email não pode estar em branco")
    @Email(message = "Formato de email inválido")
    @Size(max = 100, message = "O email não pode exceder 100 caracteres")
    protected String email;
    @NotBlank(message = "A senha não pode estar em branco")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    protected String senha;
    @NotBlank(message = "O telefone não pode estar em branco")
    @Pattern(regexp = "\\d{10,11}", message = "O telefone deve conter 10 ou 11 dígitos numéricos")
    protected String telefone;
    @NotBlank(message = "O CEP não pode estar em branco")
    @Pattern(regexp = "\\d{8}", message = "O CEP deve conter 8 dígitos numéricos")
    protected String cep;
    @Size(max = 255, message = "O complemento não pode exceder 255 caracteres")
    protected String complemento;
    @NotBlank(message = "O bairro não pode estar em branco")
    @Size(max = 100, message = "O bairro não pode exceder 100 caracteres")
    protected String bairro;
    @NotBlank(message = "A cidade não pode estar em branco")
    @Size(max = 100, message = "A cidade não pode exceder 100 caracteres")
    protected String cidade;
    @NotBlank(message = "O estado não pode estar em branco")
    @Size(min = 2, max = 2, message = "O estado deve ser a sigla (UF) com 2 caracteres")
    protected String estado;

    public Usuario() {

    }

    public Usuario(String nome, String cpf, LocalDate data_nascimento, String email, String senha, String telefone, String cep,
            String complemento, String bairro, String cidade, String estado) {
        this.nome = nome;
        this.cpf = cpf;
        this.data_nascimento = data_nascimento;
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.cep = cep;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
    }


    // Getters e Setters para a classe abstrata Usuario
    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getTelefone(){
        return telefone;
    }

    public void setTelefone(String telefone){
        this.telefone = telefone;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getComplemento() {
        return complemento;
    }

    public void setComplemento(String complemento) {
        this.complemento = complemento;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDate getData_nascimento() {
        return data_nascimento;
    }

    public void setData_nascimento(LocalDate data_nascimento) {
        this.data_nascimento = data_nascimento;
    }
    
}
