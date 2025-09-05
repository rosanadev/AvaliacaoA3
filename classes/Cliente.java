package classes;
import java.util.*;

public class Cliente extends Usuario {
    
    private String categoria; //Tipos de clientes, esse campo pode ser tabelado no banco de dados 

    public Cliente(Integer codigo, String nome, String cpf, Date dataNascimento, String email, String senha,
            String telefone, String cep, String complemento, String bairro, String cidade, String estado,
            String categoria) {
        super(codigo, nome, cpf, dataNascimento, email, senha, telefone, cep, complemento, bairro, cidade, estado);
        this.categoria = categoria;
    }

    // Getters e Setters

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }
    

    // Métodos, baseando-se nos Casos de Uso presentes na seguinte documentação: https://docs.google.com/document/d/1-LHY0OPil94ANtAvhWR81OLN35Z_yMhvjKoVWOqoHic/edit?tab=t.0

    
    public void acessar(){ // Acessar serviços

    }

    public void agendar(){ // Realizar agendamento 
 
    }

    public void gerenciaragendamento(){ // Gerenciar agendamento 


    }

    public void avaliarservico(){ // Avaliar serviço

    }

    public void remarcar(){ // Remarcar serviço

    }
    
}
