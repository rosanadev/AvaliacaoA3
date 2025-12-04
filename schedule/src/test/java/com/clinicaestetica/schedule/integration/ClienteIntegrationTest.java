package com.clinicaestetica.schedule.integration;

import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.repository.ClienteRepository;
import com.clinicaestetica.schedule.service.ClienteService;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("integration")
@Transactional
public class ClienteIntegrationTest {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ClienteRepository clienteRepository;

    @BeforeEach
    void setup() {
        clienteRepository.deleteAll();
        System.out.println("\n=== BANCO LIMPO ===");
    }

    @Test
    void testCadastrarClienteComSucesso() {
        System.out.println("\n>>> TESTE: Cadastrar Cliente");

        // Arrange
        Cliente novoCliente = new Cliente(
            "João Silva",
            "11122233344",
            LocalDate.of(1995, 3, 15),
            "joao.silva@email.com",
            "senha123",
            "11987654321",
            "01310100",
            "Apto 45",
            "Paulista",
            "São Paulo",
            "SP"
        );

        // Act
        Cliente salvo = clienteService.cadastrarCliente(novoCliente);

        // Assert
        assertNotNull(salvo.getIdUsuario());
        assertEquals("João Silva", salvo.getNome());
        assertEquals("11122233344", salvo.getCpf());

        // Verifica persistência no banco
        Cliente doBanco = clienteRepository.findById(salvo.getIdUsuario())
            .orElseThrow(() -> new AssertionError("Cliente não foi salvo!"));

        assertEquals("joao.silva@email.com", doBanco.getEmail());
        System.out.println("✅ Cliente cadastrado com ID: " + salvo.getIdUsuario());
    }

    @Test
    void testCadastrarEmailDuplicado() {
        System.out.println("\n>>> TESTE: Email Duplicado");

        Cliente primeiro = new Cliente(
            "Cliente Um",
            "11111111111",
            LocalDate.of(1990, 1, 1),
            "email@duplicado.com",
            "senha123",
            "11999999999",
            "01001000",
            "",
            "Centro",
            "São Paulo",
            "SP"
        );
        clienteService.cadastrarCliente(primeiro);


        Cliente segundo = new Cliente(
            "Cliente Dois",
            "22222222222",
            LocalDate.of(1992, 2, 2),
            "email@duplicado.com", // ← EMAIL IGUAL!
            "senha456",
            "11988888888",
            "02002000",
            "",
            "Jardins",
            "São Paulo",
            "SP"
        );

        try {
            clienteService.cadastrarCliente(segundo);
            clienteRepository.flush(); 
            
            
            List<Cliente> comMesmoEmail = clienteRepository.findAll().stream()
                .filter(c -> c.getEmail().equals("email@duplicado.com"))
                .toList();
            
            assertEquals(1, comMesmoEmail.size(), 
                "Email duplicado foi permitido! Esperado 1 cliente, encontrado: " + comMesmoEmail.size());
            
            System.out.println("⚠️ Constraint UNIQUE não impediu email duplicado no save, mas verificação manual OK");
            
        } catch (DataIntegrityViolationException | ConstraintViolationException e) {
            System.out.println("✅ Constraint UNIQUE impediu email duplicado: " + e.getClass().getSimpleName());
        } catch (Exception e) {
            if (e.getMessage().contains("email") || e.getMessage().contains("unique") || 
                e.getMessage().contains("duplicate") || e.getMessage().contains("Duplicate")) {
                System.out.println("✅ Constraint UNIQUE impediu email duplicado: " + e.getClass().getSimpleName());
            } else {
                throw e;
            }
        }
    }

    @Test
    void testCadastrarCpfDuplicado() {
        System.out.println("\n>>> TESTE: CPF Duplicado");

        // Arrange - Primeiro cliente
        Cliente primeiro = new Cliente(
            "Cliente Um",
            "12345678901",
            LocalDate.of(1990, 1, 1),
            "cliente1@test.com",
            "senha123",
            "11999999999",
            "01001000",
            "",
            "Centro",
            "São Paulo",
            "SP"
        );
        clienteService.cadastrarCliente(primeiro);

        
        Cliente segundo = new Cliente(
            "Cliente Dois",
            "12345678901", 
            LocalDate.of(1992, 2, 2),
            "cliente2@test.com",
            "senha456",
            "11988888888",
            "02002000",
            "",
            "Jardins",
            "São Paulo",
            "SP"
        );

        try {
            clienteService.cadastrarCliente(segundo);
            clienteRepository.flush(); 
            
           
            List<Cliente> comMesmoCpf = clienteRepository.findAll().stream()
                .filter(c -> c.getCpf().equals("12345678901"))
                .toList();
            
            assertEquals(1, comMesmoCpf.size(), 
                "CPF duplicado foi permitido! Esperado 1 cliente, encontrado: " + comMesmoCpf.size());
            
            System.out.println("⚠️ Constraint UNIQUE não impediu CPF duplicado no save, mas verificação manual OK");
            
        } catch (DataIntegrityViolationException | ConstraintViolationException e) {
            System.out.println("✅ Constraint UNIQUE impediu CPF duplicado: " + e.getClass().getSimpleName());
        } catch (Exception e) {
            // Outra exceção relacionada a constraint
            if (e.getMessage().contains("cpf") || e.getMessage().contains("unique") || 
                e.getMessage().contains("duplicate") || e.getMessage().contains("Duplicate")) {
                System.out.println("✅ Constraint UNIQUE impediu CPF duplicado: " + e.getClass().getSimpleName());
            } else {
                throw e; 
            }
        }
    }

    
    @Test
    void testLoginComSucesso() {
        System.out.println("\n>>> TESTE: Login com Sucesso");

        Cliente cliente = new Cliente(
            "Maria Oliveira",
            "98765432100",
            LocalDate.of(1988, 8, 20),
            "maria@login.com",
            "senhaSegura123",
            "11976543210",
            "03003000",
            "",
            "Vila Madalena",
            "São Paulo",
            "SP"
        );
        clienteService.cadastrarCliente(cliente);

        
        Optional<Cliente> logado = clienteService.login("maria@login.com", "senhaSegura123");


        assertTrue(logado.isPresent());
        assertEquals("Maria Oliveira", logado.get().getNome());
        System.out.println("✅ Login realizado: " + logado.get().getEmail());
    }

    
    @Test
    void testLoginSenhaIncorreta() {
        System.out.println("\n>>> TESTE: Login com Senha Incorreta");

        
        Cliente cliente = new Cliente(
            "Pedro Santos",
            "55566677788",
            LocalDate.of(1993, 5, 10),
            "pedro@test.com",
            "senhaCorreta",
            "11965432100",
            "04004000",
            "",
            "Moema",
            "São Paulo",
            "SP"
        );
        clienteService.cadastrarCliente(cliente);


        Optional<Cliente> logado = clienteService.login("pedro@test.com", "senhaERRADA");

        assertFalse(logado.isPresent());
        System.out.println("✅ Login negado corretamente");
    }

    @Test
    void testLoginEmailInexistente() {
        System.out.println("\n>>> TESTE: Login com Email Inexistente");

       
        Optional<Cliente> logado = clienteService.login("naoexiste@test.com", "qualquersenha");


        assertFalse(logado.isPresent());
        System.out.println("✅ Email inexistente retornou vazio");
    }

    @Test
    void testListarTodosClientes() {
        System.out.println("\n>>> TESTE: Listar Todos os Clientes");

        for (int i = 1; i <= 3; i++) {
            Cliente cliente = new Cliente(
                "Cliente " + i,
                "1111111111" + i,
                LocalDate.of(1990, 1, i),
                "cliente" + i + "@test.com",
                "senha" + i,
                "1199999999" + i,
                "0100100" + i,
                "",
                "Bairro " + i,
                "São Paulo",
                "SP"
            );
            clienteService.cadastrarCliente(cliente);
        }

        
        List<Cliente> todos = clienteService.listarClientes();

        assertEquals(3, todos.size());
        System.out.println("✅ Total de clientes: " + todos.size());

        for (Cliente c : todos) {
            System.out.println("  - " + c.getNome() + " (" + c.getEmail() + ")");
        }
    }

    @Test
    void testBuscarClientePorId() {
        System.out.println("\n>>> TESTE: Buscar Cliente por ID");

        Cliente cliente = new Cliente(
            "Ana Costa",
            "99988877766",
            LocalDate.of(1991, 11, 25),
            "ana@test.com",
            "senha789",
            "11954321098",
            "05005000",
            "Casa 10",
            "Pinheiros",
            "São Paulo",
            "SP"
        );
        Cliente salvo = clienteService.cadastrarCliente(cliente);

        Cliente encontrado = clienteService.getCliente(salvo.getIdUsuario());

        assertNotNull(encontrado);
        assertEquals("Ana Costa", encontrado.getNome());
        assertEquals(salvo.getIdUsuario(), encontrado.getIdUsuario());
        System.out.println("✅ Cliente encontrado: " + encontrado.getNome());
    }

    @Test
    void testBuscarClienteInexistente() {
        System.out.println("\n>>> TESTE: Buscar Cliente Inexistente");

        assertThrows(Exception.class, () -> {
            clienteService.getCliente(999L);
        });

        System.out.println("✅ Exceção lançada corretamente para ID inexistente");
    }

  
    @Test
    void testCpfFormatoInvalido() {
        System.out.println("\n>>> TESTE: CPF Formato Inválido");

    
        Cliente clienteInvalido = new Cliente(
            "Teste Invalido",
            "ABC12345678", 
            LocalDate.of(1990, 1, 1),
            "teste@invalido.com",
            "senha123",
            "11999999999",
            "01001000",
            "",
            "Centro",
            "São Paulo",
            "SP"
        );

        assertThrows(Exception.class, () -> {
            clienteService.cadastrarCliente(clienteInvalido);
        });

        System.out.println("✅ Validação de CPF funcionando");
    }
}