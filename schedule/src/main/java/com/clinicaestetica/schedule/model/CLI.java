package com.clinicaestetica.schedule.model;

import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.model.Servico;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.JsonNode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

public class CLI {

    private static final String BASE_URL = "http://localhost:8080";
    private static final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());
    private static final Scanner scanner = new Scanner(System.in);
    private static Optional<Cliente> clienteLogado = Optional.empty();

    public static void main(String[] args) {
        
        System.out.println("CLÍNICA ESTÉTICA ROSA BEAUTY");
        
        while (true) {
            System.out.println("\n-------------------------------------");
            System.out.println("O que você deseja fazer?");
            System.out.println("1. Realizar cadastro");
            System.out.println("2. Fazer login");
            System.out.println("3. Sair");
            System.out.print("Digite sua opção: ");
            
            try {
                int opcao = scanner.nextInt();
                scanner.nextLine(); // Limpa o buffer do scanner

                switch (opcao) {
                    case 1:
                        cadastrarCliente();
                        break;
                    case 2:
                        escolhaLogin();
                        break;
                    case 3:
                        System.out.println("Saindo...");
                        return; // Encerra o programa
                    default:
                        System.out.println("Opção inválida. Tente novamente.");
                }
            } catch (java.util.InputMismatchException e) {
                System.out.println("Entrada inválida. Por favor, digite um número.");
                scanner.nextLine(); // Limpa o buffer
            }
        }
    }

    private static void cadastrarCliente() {
        System.out.println("\n--- CADASTRO DE CLIENTE ---");
        try {
            System.out.print("Nome: ");
            String nome = scanner.nextLine();
            System.out.print("CPF (apenas números): ");
            String cpf = scanner.nextLine();
            System.out.print("Data de Nascimento (formato dd/MM/yyyy): ");
            String dataNascimentoString = scanner.nextLine();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            LocalDate dataNascimento = LocalDate.parse(dataNascimentoString, formatter);
            System.out.print("Email: ");
            String email = scanner.nextLine();
            System.out.print("Senha: ");
            String senha = scanner.nextLine();
            System.out.print("Telefone: ");
            String telefone = scanner.nextLine();
            System.out.print("CEP: ");
            String cep = scanner.nextLine();
            System.out.print("Complemento: ");
            String complemento = scanner.nextLine();
            System.out.print("Bairro: ");
            String bairro = scanner.nextLine();
            System.out.print("Cidade: ");
            String cidade = scanner.nextLine();
            System.out.print("Estado (UF): ");
            String estado = scanner.nextLine();
            
            Cliente novoCliente = new Cliente(
                nome,
                cpf,
                dataNascimento,
                email,
                senha,
                telefone,
                cep,
                complemento,
                bairro,
                cidade,
                estado
            );

            String requestBody = objectMapper.writeValueAsString(novoCliente);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/clientes"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                System.out.println("Cliente cadastrado com sucesso!");
                System.out.println("Detalhes: " + response.body());
            } else {
                System.out.println("Falha ao cadastrar cliente. Status: " + response.statusCode());
                System.out.println("Erro: " + response.body());
            }
            
        } catch (Exception e) {
            System.err.println("Ocorreu um erro no cadastro: " + e.getMessage());
        }
    }

    private static void loginCliente() {
        System.out.println("\n--- LOGIN DO CLIENTE ---");
        try {
            System.out.print("Email: ");
            String email = scanner.nextLine();
            System.out.print("Senha: ");
            String senha = scanner.nextLine();

            Cliente credenciais = new Cliente();
            credenciais.setEmail(email);
            credenciais.setSenha(senha);
            
            String requestBody = objectMapper.writeValueAsString(credenciais);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/clientes/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.body()); 
            String nome = jsonNode.get("nome").asText().toUpperCase(); // extrair nome do response do JSON

            if (response.statusCode() == 200) {
                System.out.println("Login realizado com sucesso!");
                System.out.println("OLÁ, " + nome);
                listarServicos();
            } else {
                System.out.println("Falha no login. Status: " + response.statusCode());
                System.out.println("Erro: " + response.body());
            }

        } catch (Exception e) {
            System.err.println("Ocorreu um erro no login: " + e.getMessage());
        }
    }

        private static void loginProfissional() {
        System.out.println("\n--- LOGIN DO PROFISSIONAL ---");
        try {
            System.out.print("Email: ");
            String email = scanner.nextLine();
            System.out.print("Senha: ");
            String senha = scanner.nextLine();

            Profissional credenciais = new Profissional();
            credenciais.setEmail(email);
            credenciais.setSenha(senha);
            
            String requestBody = objectMapper.writeValueAsString(credenciais);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/profissionais/login"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.body()); 
            String nome = jsonNode.get("nome").asText().toUpperCase(); // extrair nome do response do JSON

            if (response.statusCode() == 200) {
                System.out.println("Login realizado com sucesso!");
                System.out.println("OLÁ, " + nome);
                
            } else {
                System.out.println("Falha no login. Status: " + response.statusCode());
                System.out.println("Erro: " + response.body());
            }

        } catch (Exception e) {
            System.err.println("Ocorreu um erro no login: " + e.getMessage());
        }
    }
    
    private static void escolhaLogin(){

        while (true) {
            
        
            System.out.println("\n--- LOGIN ---");
            System.out.println("1. Área do cliente");
            System.out.println("2. Área do funcionário");
            System.out.println("3. Voltar ao menu");
            System.out.print("Digite sua opção: ");;

            try{
                int opcao = scanner.nextInt();
                scanner.nextLine();

                switch (opcao) {
                    case 1:
                        loginCliente();
                        break;
                    case 2:
                        loginProfissional();
                        break;
                
                    default:
                        System.out.println("Opção inválida. Tente novamente.");;
                }

            }
            catch (java.util.InputMismatchException e){
                System.out.println("Entrada inválida. Por favor, digite um número");
                scanner.nextLine();
            }
        }

    }
    private static void listarServicos() {
        System.out.println("\n--- SERVIÇOS DISPONÍVEIS ---");
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/servicos"))
                .GET()
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                List<Servico> servicos = objectMapper.readValue(response.body(), new TypeReference<List<Servico>>() {});
                
                if (servicos.isEmpty()) {
                    System.out.println("Nenhum serviço disponível no momento.");
                } else {
                    servicos.forEach(servico -> {
                        System.out.println("ID: " + servico.getId());
                        System.out.println("Nome: " + servico.getNome());
                        System.out.println("Preço: R$ " + servico.getPreco());
                        System.out.println("Duração (minutos): " + servico.getDuracaoEmMinutos());
                        System.out.println("-------------------------------------");
                    });
                }
            } else {
                System.out.println("Falha ao listar serviços. Status: " + response.statusCode());
            }

        } catch (Exception e) {
            System.err.println("Ocorreu um erro ao listar serviços: " + e.getMessage());
        }
    }
}