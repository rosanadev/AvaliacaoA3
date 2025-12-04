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

    @BeforeEach
    void setup() {

        agendamentoRepository.deleteAll();
        clienteRepository.deleteAll();
        profissionalRepository.deleteAll();
        servicoRepository.deleteAll();

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


    @Test
    void testAgendarServicoComSucesso() {
        System.out.println("\n>>> TESTE: Agendar Serviço com Sucesso");


        LocalDateTime dataHoraValida = LocalDateTime.now().plusDays(2).withHour(10).withMinute(0).withSecond(0);
        
        Agendamento novoAgendamento = new Agendamento();
        novoAgendamento.setDataHora(dataHoraValida);
        novoAgendamento.setCliente(cliente);
        novoAgendamento.setProfissional(profissional);
        novoAgendamento.setServico(servico);
        novoAgendamento.setPagamentoParcial(false);


        Agendamento salvo = agendamentoService.agendarServico(novoAgendamento);


        assertNotNull(salvo.getIdAgendamento());
        assertEquals(StatusAgendamento.AGENDADO, salvo.getStatus());


        Agendamento doBanco = agendamentoRepository.findById(salvo.getIdAgendamento())
            .orElseThrow(() -> new AssertionError("Agendamento não foi salvo no banco!"));

        assertEquals(cliente.getIdUsuario(), doBanco.getCliente().getIdUsuario());
        assertEquals(profissional.getIdUsuario(), doBanco.getProfissional().getIdUsuario());
        assertEquals(servico.getId(), doBanco.getServico().getId());
        assertNotNull(doBanco.getPagamento());

        System.out.println("✅ Agendamento salvo com ID: " + salvo.getIdAgendamento());
    }


    @Test
    void testAgendarComPagamentoParcial() {
        System.out.println("\n>>> TESTE: Agendar com Pagamento Parcial");


        LocalDateTime dataHoraValida = LocalDateTime.now().plusDays(3).withHour(14).withMinute(0).withSecond(0);
        
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(dataHoraValida);
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(true);


        Agendamento salvo = agendamentoService.agendarServico(agendamento);


        assertNotNull(salvo.getPagamento());
        BigDecimal valorEsperado = servico.getPreco().divide(new BigDecimal("2"));
        assertEquals(0, valorEsperado.compareTo(salvo.getPagamento().getValor()));

        System.out.println("✅ Pagamento parcial: " + salvo.getPagamento().getValor());
    }


    @Test
    void testAgendarHorarioConflito() {
        System.out.println("\n>>> TESTE: Conflito de Horário");


        LocalDateTime dataHora = LocalDateTime.now().plusDays(5).withHour(10).withMinute(0).withSecond(0);

        Agendamento primeiro = new Agendamento();
        primeiro.setDataHora(dataHora);
        primeiro.setCliente(cliente);
        primeiro.setProfissional(profissional);
        primeiro.setServico(servico);
        primeiro.setPagamentoParcial(false);
        agendamentoService.agendarServico(primeiro);


        Agendamento segundo = new Agendamento();
        segundo.setDataHora(dataHora);
        segundo.setCliente(cliente);
        segundo.setProfissional(profissional);
        segundo.setServico(servico);
        segundo.setPagamentoParcial(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            agendamentoService.agendarServico(segundo);
        });

        assertTrue(exception.getMessage().contains("Horário indisponível"));
        System.out.println("✅ Conflito detectado corretamente: " + exception.getMessage());
    }


    @Test
    void testCancelarAgendamento() {
        System.out.println("\n>>> TESTE: Cancelar Agendamento");


        LocalDateTime dataHoraValida = LocalDateTime.now().plusDays(10).withHour(10).withMinute(0).withSecond(0);
        
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(dataHoraValida);
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(false);
        Agendamento salvo = agendamentoService.agendarServico(agendamento);


        boolean cancelado = agendamentoService.cancelarAgendamento(salvo.getIdAgendamento());


        assertTrue(cancelado);


        Agendamento atualizado = agendamentoRepository.findById(salvo.getIdAgendamento())
            .orElseThrow();

        assertEquals(StatusAgendamento.CANCELADO, atualizado.getStatus());
        assertNotNull(atualizado.getDataCancelamento());

        System.out.println("✅ Agendamento cancelado em: " + atualizado.getDataCancelamento());
    }

    @Test
    void testReagendarAgendamento() {
        System.out.println("\n>>> TESTE: Reagendar Agendamento");


        LocalDateTime dataOriginal = LocalDateTime.now().plusDays(7).withHour(10).withMinute(0).withSecond(0);
        
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(dataOriginal);
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(false);
        Agendamento salvo = agendamentoService.agendarServico(agendamento);

        LocalDateTime novaData = LocalDateTime.now().plusDays(10).withHour(14).withMinute(0).withSecond(0);
        Agendamento reagendado = agendamentoService.reagendarAgendamento(
            salvo.getIdAgendamento(), 
            novaData
        );


        assertEquals(novaData, reagendado.getDataHora());
        assertEquals(StatusAgendamento.ALTERADO, reagendado.getStatus());

        Agendamento doBanco = agendamentoRepository.findById(salvo.getIdAgendamento())
            .orElseThrow();
        assertEquals(novaData, doBanco.getDataHora());

        System.out.println("✅ Reagendado de " + dataOriginal + " para " + novaData);
    }

    @Test
    void testListarTodosAgendamentos() {
        System.out.println("\n>>> TESTE: Listar Todos os Agendamentos");

        int[] horas = {9, 11, 15}; 
        
        for (int i = 0; i < 3; i++) {
            LocalDateTime dataHoraValida = LocalDateTime.now().plusDays(i + 1)
                .withHour(horas[i])
                .withMinute(0)
                .withSecond(0);
            
            Agendamento ag = new Agendamento();
            ag.setDataHora(dataHoraValida);
            ag.setCliente(cliente);
            ag.setProfissional(profissional);
            ag.setServico(servico);
            ag.setPagamentoParcial(false);
            agendamentoService.agendarServico(ag);
        }

        List<Agendamento> todos = agendamentoService.listarAgendamentos();


        assertEquals(3, todos.size());


        for (Agendamento ag : todos) {
            assertNotNull(ag.getCliente());
            assertNotNull(ag.getProfissional());
            assertNotNull(ag.getServico());
            System.out.println("Agendamento ID: " + ag.getIdAgendamento() + 
                             " - Cliente: " + ag.getCliente().getNome());
        }

        System.out.println("✅ Total de agendamentos: " + todos.size());
    }


    @Test
    void testIntegridadeReferencialCliente() {
        System.out.println("\n>>> TESTE: Integridade Referencial - Cliente");

        LocalDateTime dataHoraValida = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0);
        
        Agendamento agendamento = new Agendamento();
        agendamento.setDataHora(dataHoraValida);
        agendamento.setCliente(cliente);
        agendamento.setProfissional(profissional);
        agendamento.setServico(servico);
        agendamento.setPagamentoParcial(false);
        agendamentoService.agendarServico(agendamento);

        assertThrows(Exception.class, () -> {
            clienteRepository.deleteById(cliente.getIdUsuario());
            clienteRepository.flush(); 
        });

        System.out.println("✅ Constraint FK impediu delete de cliente com agendamento");
    }
}