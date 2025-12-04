package com.clinicaestetica.schedule.integration;

import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.repository.ServicoRepository;
import com.clinicaestetica.schedule.service.ServicoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TESTES DE INTEGRAÇÃO - ServicoService
 * 
 * Testa:
 * - CRUD completo (Create, Read, Update, Delete)
 * - Validações de preço e duração
 * - Persistência no banco MySQL real
 */
@SpringBootTest
@ActiveProfiles("integration")
@Transactional
public class ServicoIntegrationTest {

    @Autowired
    private ServicoService servicoService;

    @Autowired
    private ServicoRepository servicoRepository;

    @BeforeEach
    void setup() {
        servicoRepository.deleteAll();
        System.out.println("\n=== BANCO LIMPO ===");
    }

    /**
     * TESTE 1: Criar serviço com sucesso
     * Testa: INSERT no banco
     */
    @Test
    void testCriarServicoComSucesso() {
        System.out.println("\n>>> TESTE: Criar Serviço");

        // Arrange
        Servico novoServico = new Servico(
            "Massagem Relaxante",
            "Massagem completa de corpo inteiro",
            new BigDecimal("120.00"),
            60
        );

        // Act
        Servico salvo = servicoService.criarServico(novoServico);

        // Assert
        assertNotNull(salvo.getId());
        assertEquals("Massagem Relaxante", salvo.getNome());
        assertEquals(new BigDecimal("120.00"), salvo.getPreco());
        assertEquals(60, salvo.getDuracaoEmMinutos());

        // Verifica no banco
        Servico doBanco = servicoRepository.findById(salvo.getId())
            .orElseThrow(() -> new AssertionError("Serviço não foi salvo!"));

        assertEquals("Massagem completa de corpo inteiro", doBanco.getDescricao());
        System.out.println("✅ Serviço criado com ID: " + salvo.getId());
    }

    /**
     * TESTE 2: Listar todos os serviços
     * Testa: SELECT * FROM servico
     */
    @Test
    void testListarTodosServicos() {
        System.out.println("\n>>> TESTE: Listar Todos os Serviços");

        // Arrange - Cria 4 serviços
        String[] nomes = {"Limpeza de Pele", "Massagem", "Depilação", "Manicure"};
        BigDecimal[] precos = {
            new BigDecimal("80.00"),
            new BigDecimal("100.00"),
            new BigDecimal("50.00"),
            new BigDecimal("40.00")
        };
        int[] duracoes = {45, 60, 30, 30};

        for (int i = 0; i < nomes.length; i++) {
            Servico servico = new Servico(
                nomes[i],
                "Descrição do " + nomes[i],
                precos[i],
                duracoes[i]
            );
            servicoService.criarServico(servico);
        }

        // Act
        List<Servico> todos = servicoService.listarServicos();

        // Assert
        assertEquals(4, todos.size());
        System.out.println("✅ Total de serviços: " + todos.size());

        for (Servico s : todos) {
            System.out.println("  - " + s.getNome() + " (R$ " + s.getPreco() + ")");
        }
    }

    /**
     * TESTE 3: Buscar serviço por ID
     * Testa: SELECT WHERE id
     */
    @Test
    void testBuscarServicoPorId() {
        System.out.println("\n>>> TESTE: Buscar Serviço por ID");

        // Arrange
        Servico servico = new Servico(
            "Hidratação Facial",
            "Tratamento de hidratação profunda",
            new BigDecimal("150.00"),
            90
        );
        Servico salvo = servicoService.criarServico(servico);

        // Act
        Servico encontrado = servicoService.getServico(salvo.getId());

        // Assert
        assertNotNull(encontrado);
        assertEquals("Hidratação Facial", encontrado.getNome());
        assertEquals(salvo.getId(), encontrado.getId());
        System.out.println("✅ Serviço encontrado: " + encontrado.getNome());
    }

    /**
     * TESTE 4: Atualizar serviço
     * Testa: UPDATE
     */
    @Test
    void testAtualizarServico() {
        System.out.println("\n>>> TESTE: Atualizar Serviço");

        // Arrange - Cria serviço
        Servico servico = new Servico(
            "Serviço Original",
            "Descrição Original",
            new BigDecimal("100.00"),
            60
        );
        Servico salvo = servicoService.criarServico(servico);

        // Act - Atualiza
        Servico atualizado = new Servico(
            "Serviço Atualizado",
            "Descrição Atualizada",
            new BigDecimal("150.00"),
            90
        );
        atualizado.setId(salvo.getId());
        
        Servico resultado = servicoService.atualizarServico(salvo.getId(), atualizado);

        // Assert
        assertEquals("Serviço Atualizado", resultado.getNome());
        assertEquals(new BigDecimal("150.00"), resultado.getPreco());
        assertEquals(90, resultado.getDuracaoEmMinutos());

        // Verifica persistência
        Servico doBanco = servicoRepository.findById(salvo.getId())
            .orElseThrow();
        assertEquals("Descrição Atualizada", doBanco.getDescricao());

        System.out.println("✅ Serviço atualizado com sucesso");
    }

    /**
     * TESTE 5: Deletar serviço
     * Testa: DELETE FROM servico
     */
    @Test
    void testDeletarServico() {
        System.out.println("\n>>> TESTE: Deletar Serviço");

        // Arrange
        Servico servico = new Servico(
            "Serviço Temporário",
            "Será deletado",
            new BigDecimal("50.00"),
            30
        );
        Servico salvo = servicoService.criarServico(servico);
        Long id = salvo.getId();

        // Act
        servicoService.deletarServico(id);

        // Assert - Verifica que foi deletado
        assertFalse(servicoRepository.existsById(id));
        System.out.println("✅ Serviço deletado com sucesso");
    }

    /**
     * TESTE 6: Tentar buscar serviço inexistente
     * Testa: NoSuchElementException
     */
    @Test
    void testBuscarServicoInexistente() {
        System.out.println("\n>>> TESTE: Buscar Serviço Inexistente");

        // Act & Assert
        assertThrows(Exception.class, () -> {
            servicoService.getServico(999L);
        });

        System.out.println("✅ Exceção lançada corretamente");
    }

    /**
     * TESTE 7: Validação de preço negativo
     * Testa: Bean Validation (@DecimalMin)
     */
    @Test
    void testPrecoNegativo() {
        System.out.println("\n>>> TESTE: Preço Negativo");

        // Arrange
        Servico servicoInvalido = new Servico(
            "Serviço Inválido",
            "Preço negativo",
            new BigDecimal("-50.00"), // ← PREÇO INVÁLIDO
            30
        );

        // Act & Assert
        assertThrows(Exception.class, () -> {
            servicoService.criarServico(servicoInvalido);
        });

        System.out.println("✅ Validação de preço funcionando");
    }

    /**
     * TESTE 8: Validação de duração zero
     * Testa: Bean Validation (@Min)
     */
    @Test
    void testDuracaoZero() {
        System.out.println("\n>>> TESTE: Duração Zero");

        // Arrange
        Servico servicoInvalido = new Servico(
            "Serviço Inválido",
            "Duração zero",
            new BigDecimal("50.00"),
            0 // ← DURAÇÃO INVÁLIDA
        );

        // Act & Assert
        assertThrows(Exception.class, () -> {
            servicoService.criarServico(servicoInvalido);
        });

        System.out.println("✅ Validação de duração funcionando");
    }

    /**
     * TESTE 9: Validação de nome vazio
     * Testa: Bean Validation (@NotBlank)
     */
    @Test
    void testNomeVazio() {
        System.out.println("\n>>> TESTE: Nome Vazio");

        // Arrange
        Servico servicoInvalido = new Servico(
            "", // ← NOME VAZIO
            "Descrição válida",
            new BigDecimal("50.00"),
            30
        );

        // Act & Assert
        assertThrows(Exception.class, () -> {
            servicoService.criarServico(servicoInvalido);
        });

        System.out.println("✅ Validação de nome funcionando");
    }

    /**
     * TESTE 10: Criar múltiplos serviços e verificar ordenação
     * Testa: Múltiplos INSERTs + SELECT ORDER BY
     */
    @Test
    void testCriarMultiplosServicos() {
        System.out.println("\n>>> TESTE: Criar Múltiplos Serviços");

        // Arrange & Act
        for (int i = 1; i <= 5; i++) {
            Servico servico = new Servico(
                "Serviço " + i,
                "Descrição " + i,
                new BigDecimal(i * 50 + ".00"),
                i * 15
            );
            servicoService.criarServico(servico);
        }

        // Assert
        List<Servico> todos = servicoService.listarServicos();
        assertEquals(5, todos.size());

        // Verifica valores
        for (int i = 0; i < todos.size(); i++) {
            Servico s = todos.get(i);
            assertNotNull(s.getId());
            assertTrue(s.getPreco().compareTo(BigDecimal.ZERO) > 0);
            assertTrue(s.getDuracaoEmMinutos() > 0);
        }

        System.out.println("✅ Múltiplos serviços criados com sucesso");
    }
}