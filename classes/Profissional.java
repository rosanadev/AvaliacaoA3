package classes;
import java.util.*;

public class Profissional extends Usuario {
    
    private String carteira; // Número da carteira para trabalhar
    private int especialidade; // Acho melhor esse campo ser tabelado no banco, porque pode ter biomédicos e esteticistas, 
                           // esse campo seria o de id das profissões
    
    public Profissional(Integer codigo, String nome, String cpf, Date dataNascimento, String email, String senha, String telefone,
        String cep, String complemento, String bairro, String cidade, String estado, String carteira,
        int especialidade) {
        super(codigo, nome, cpf, dataNascimento, email, senha, telefone, cep, complemento, bairro, cidade, estado);
        this.carteira = carteira;
        this.especialidade = especialidade;
    }

    //Getters e Setters para Profissional

    public String getCarteira() {
        return carteira;
    }

    public void setCarteira(String carteira) {
        this.carteira = carteira;
    }

    public int getEspecialidade() {
        return especialidade;
    }

    public void setEspecialidade(int especialidade) {
        this.especialidade = especialidade;
    }

    

    
}
