package com.clinicaestetica.schedule.integration;

import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.repository.ClienteRepository;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.repository.ServicoRepository;
import com.clinicaestetica.schedule.service.AgendamentoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * TESTES DE INTEGRAÇÃO - AgendamentoService
 * 
 * Diferenças dos testes unitários:
 * - Usa banco MySQL REAL (não H2 em memória)
 * - NÃO usa mocks - testa integração real entre camadas
 * - Testa relacionamentos JPA (FK, cascade, etc)
 * - Testa constraints do banco
 * - @Transactional faz rollback após cada teste (banco limpo)
 */
@SpringBootTest
@ActiveProfiles("integration")
@Transactional
public class AgendamentoIntegrationTest {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;

    @Autowired
    private ServicoRepository servicoRepository;

    private Cliente cliente;
    private Profissional profissional;
    private Servico servico;

    /**
     * Setup executado ANTES de cada teste
     * Cria dados base necessários
     */
    @BeforeEach
    void setup() {
        // Limpa banco antes de cada teste
        agendamentoRepository.deleteAll();
        clienteRepository.deleteAll();
        profissionalRepository.deleteAll();
        servicoRepository.deleteAll();

        // Cria Cliente
        cliente = new Cliente(
            "Cliente Teste Integração",
            "12345678901",
            LocalDate.of(1990, 1, 1),
            "cliente.integracao@test.com",
            "senha123",
            "11999999999",
            "01001000",
            "Apto 101",
            "Centro",
            "São Paulo",
            "SP"
        );
        cliente = clienteRepository.save(cliente);

        // Cria Profissional
        profissional = new Profissional(
            "Profissional Teste Integração",
            "98765432100",
            LocalDate.of(1985, 5, 15),
            "prof.integracao@test.com",
            "senha456",
            "11988888888",
            "02002000",
            "Sala 202",
            "Jardins",
            "São Paulo",
            "SP",
            "CREF-123456",
            "REG-789"
        );
        profissional = profissionalRepository.save(profissional);

        // Cria Serviço
        servico = new Servico(
            "Massagem Relaxante",
            "Massagem completa de 60 minutos",
            new BigDecimal("150.00"),
            60
        );
        servico = servicoRepository.save(servico);

        System.out.println("\n=== SETUP COMPLETO ===");
        System.out.println("Cliente ID: " + cliente.getIdUsuario());
        System.out.println("Profissional ID: " + profissional.getIdUsuario());
        System.out.println("Serviço ID: " + servico.getId());
    }

    /**
     * TESTE 1: Agendar serviço com sucesso
     * Testa: INSERT no banco + relacionamentos FK
     */
    @Test
    void testAgendarServicoComSucesso() {
        System.out.println("\n>>> TESTE: Agendar Serviço com Sucesso");

        // Arrange
        Agendamento novoAgendamento = new Agendamento();
        novoAgendamento.setDataHora(LocalDateTime.now().plusDays(2));
        novoAgendamento.setCliente(cliente);
        novoAgendamento.setProfissional(profissional);
        novoAgendamento.setServico(servico);
        novoAgendamento.setPagamentoParcial(false);

        // Act
        Agendamento salvo = agendamentoService.agendarServico(novoAgendamento);

        // Assert - Verifica se salvou
        assertNotNull(salvo.getIdAgendamento());
        assertEquals(StatusAgendamento.AGENDADO, salvo.getStatus());

        // Assert - Busca do banco para confirmar persistência
        Agendamento doBanco = agendamentoRepository.findById(salvo.getIdAgendamento())
            .orElseThrow(() -> new AssertionError("Agendamento não foi salvo no banco!"));

        assertEquals(cliente.getIdUsuario(), doBanco.getCliente().getIdUsuario());
        assertEquals(profissional.getIdUsuario(), doBanco.getProfissional().getIdUsuario());
        assertEquals(servico.getId(), doBanco.getServico().getId());
        assertNotNull(doBanco.getPagamento());

        System.out.println("✅ Agendamento salvo com ID: " + salvo.getIdAgendamento());
    }

    /**
     * TESTE 2: Agendar com pagamento parcial
     * Testa: Cálculo de pagamento + cascade save
     */
    @Test
    void testAgendarComPagamentoParcial() {
        System.out.println("\n>>> TESTE: Agendar com Pagamento Parcial");

        // Arrange
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(LocalDateTime.now().plusDays(3));
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(true);

        // Act
        Agendamento salvo = agendamentoService.agendarServico(agendamento);

        // Assert - Verifica pagamento parcial (50%)
        assertNotNull(salvo.getPagamento());
        BigDecimal valorEsperado = servico.getPreco().divide(new BigDecimal("2"));
        assertEquals(0, valorEsperado.compareTo(salvo.getPagamento().getValor()));

        System.out.println("✅ Pagamento parcial: " + salvo.getPagamento().getValor());
    }

    /**
     * TESTE 3: Tentativa de agendar horário já ocupado
     * Testa: Constraint de horário único por profissional
     */
    @Test
    void testAgendarHorarioConflito() {
        System.out.println("\n>>> TESTE: Conflito de Horário");

        // Arrange - Primeiro agendamento
        LocalDateTime dataHora = LocalDateTime.now().plusDays(5).withHour(10).withMinute(0);

        Agendamento primeiro = new Agendamento();
        primeiro.setDataHora(dataHora);
        primeiro.setCliente(cliente);
        primeiro.setProfissional(profissional);
        primeiro.setServico(servico);
        primeiro.setPagamentoParcial(false);
        agendamentoService.agendarServico(primeiro);

        // Arrange - Segundo agendamento (MESMO horário e profissional)
        Agendamento segundo = new Agendamento();
        segundo.setDataHora(dataHora);
        segundo.setCliente(cliente);
        segundo.setProfissional(profissional);
        segundo.setServico(servico);
        segundo.setPagamentoParcial(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            agendamentoService.agendarServico(segundo);
        });

        assertTrue(exception.getMessage().contains("Horário indisponível"));
        System.out.println("✅ Conflito detectado corretamente: " + exception.getMessage());
    }

    /**
     * TESTE 4: Cancelar agendamento
     * Testa: UPDATE status + data cancelamento
     */
    @Test
    void testCancelarAgendamento() {
        System.out.println("\n>>> TESTE: Cancelar Agendamento");

        // Arrange - Cria agendamento
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(LocalDateTime.now().plusDays(10));
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(false);
        Agendamento salvo = agendamentoService.agendarServico(agendamento);

        // Act
        boolean cancelado = agendamentoService.cancelarAgendamento(salvo.getIdAgendamento());

        // Assert
        assertTrue(cancelado);

        // Verifica no banco
        Agendamento atualizado = agendamentoRepository.findById(salvo.getIdAgendamento())
            .orElseThrow();

        assertEquals(StatusAgendamento.CANCELADO, atualizado.getStatus());
        assertNotNull(atualizado.getDataCancelamento());

        System.out.println("✅ Agendamento cancelado em: " + atualizado.getDataCancelamento());
    }

    /**
     * TESTE 5: Reagendar agendamento
     * Testa: UPDATE data + status ALTERADO
     */
    @Test
    void testReagendarAgendamento() {
        System.out.println("\n>>> TESTE: Reagendar Agendamento");

        // Arrange - Cria agendamento
        LocalDateTime dataOriginal = LocalDateTime.now().plusDays(7);
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(dataOriginal);
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(false);
        Agendamento salvo = agendamentoService.agendarServico(agendamento);

        // Act
        LocalDateTime novaData = LocalDateTime.now().plusDays(10);
        Agendamento reagendado = agendamentoService.reagendarAgendamento(
            salvo.getIdAgendamento(), 
            novaData
        );

        // Assert
        assertEquals(novaData, reagendado.getDataHora());
        assertEquals(StatusAgendamento.ALTERADO, reagendado.getStatus());

        // Verifica persistência
        Agendamento doBanco = agendamentoRepository.findById(salvo.getIdAgendamento())
            .orElseThrow();
        assertEquals(novaData, doBanco.getDataHora());

        System.out.println("✅ Reagendado de " + dataOriginal + " para " + novaData);
    }

    /**
     * TESTE 6: Listar todos os agendamentos
     * Testa: SELECT * + lazy loading de relacionamentos
     */
    @Test
    void testListarTodosAgendamentos() {
        System.out.println("\n>>> TESTE: Listar Todos os Agendamentos");

        // Arrange - Cria 3 agendamentos
        for (int i = 0; i < 3; i++) {
            Agendamento ag = new Agendamento();
            ag.setDataHora(LocalDateTime.now().plusDays(i + 1));
            ag.setCliente(cliente);
            ag.setProfissional(profissional);
            ag.setServico(servico);
            ag.setPagamentoParcial(false);
            agendamentoService.agendarServico(ag);
        }

        // Act
        List<Agendamento> todos = agendamentoService.listarAgendamentos();

        // Assert
        assertEquals(3, todos.size());

        // Verifica se relacionamentos foram carregados
        for (Agendamento ag : todos) {
            assertNotNull(ag.getCliente());
            assertNotNull(ag.getProfissional());
            assertNotNull(ag.getServico());
            System.out.println("Agendamento ID: " + ag.getIdAgendamento() + 
                             " - Cliente: " + ag.getCliente().getNome());
        }

        System.out.println("✅ Total de agendamentos: " + todos.size());
    }

    /**
     * TESTE 7: Deletar cliente deve falhar se tiver agendamento
     * Testa: Constraint FK + integridade referencial
     */
    @Test
    void testIntegridadeReferencialCliente() {
        System.out.println("\n>>> TESTE: Integridade Referencial - Cliente");

        // Arrange - Cria agendamento
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(LocalDateTime.now().plusDays(1));
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(false);
        agendamentoService.agendarServico(agendamento);

        // Act & Assert - Tentar deletar cliente deve falhar
        assertThrows(Exception.class, () -> {
            clienteRepository.deleteById(cliente.getIdUsuario());
            clienteRepository.flush(); // Força execução no banco
        });

        System.out.println("✅ Constraint FK impediu delete de cliente com agendamento");
    }
}