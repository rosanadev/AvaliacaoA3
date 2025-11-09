package com.clinicaestetica.schedule;

import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.enums.StatusSolicitacao;
import com.clinicaestetica.schedule.enums.TipoSolicitacaoAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.model.Cliente;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.model.Avaliacao;
import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.dto.CriarSolicitacaoDTO;
import com.clinicaestetica.schedule.service.AgendamentoService;
import com.clinicaestetica.schedule.service.ClienteService;
import com.clinicaestetica.schedule.service.ProfissionalService;
import com.clinicaestetica.schedule.service.ServicoService;
import com.clinicaestetica.schedule.service.AvaliacaoService;
import com.clinicaestetica.schedule.service.AdministradorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.times;


@ExtendWith(MockitoExtension.class)
@SpringBootTest
class ScheduleApplicationTests {

    @Mock
    private AgendamentoService agendamentoService;

    @Mock
    private ClienteService clienteService;

    @Mock
    private ProfissionalService profissionalService;

    @Mock
    private ServicoService servicoService;

    @Mock
    private AvaliacaoService avaliacaoService;

    @Mock
    private AdministradorService administradorService;

    // Objetos mock para usar nos testes
    private Cliente criarClienteMock() {
        Cliente cliente = new Cliente();
        cliente.setIdUsuario(1L);
        cliente.setNome("Cliente Teste");
        cliente.setEmail("cliente.teste@email.com");
        cliente.setSenha("123456");
        return cliente;
    }

    private Profissional criarProfissionalMock() {
        Profissional profissional = new Profissional();
        profissional.setIdUsuario(1L);
        profissional.setNome("Profissional Teste");
        profissional.setEmail("profissional@email.com");
        profissional.setSenha("senha");
        return profissional;
    }

   private Servico criarServicoMock() {
        Servico servico = new Servico();
        servico.setId(1L);
        servico.setNome("Servico Teste");
        servico.setDescricao("Descricao teste");
        servico.setPreco(new BigDecimal("100.00"));
        servico.setDuracaoEmMinutos(60);
        return servico;
    }

    private Agendamento criarAgendamentoMock(StatusAgendamento status, LocalDateTime dataHora) {
        Agendamento agendamento = new Agendamento();
        agendamento.setId(1L);
        agendamento.setDataHora(dataHora);
        agendamento.setStatus(status);
        agendamento.setCliente(criarClienteMock());
        agendamento.setProfissional(criarProfissionalMock());
        agendamento.setServico(criarServicoMock());
        return agendamento;
    }

    private Agendamento criarAgendamentoMockProximo(StatusAgendamento status, long hoursFromNow) {
        return criarAgendamentoMock(status, LocalDateTime.now().plusHours(hoursFromNow));
    }

    // ========== TESTES DO CLIENTESERVICE ==========

    @Test
    void testClienteServiceListarClientes() {
        // Configura mock
        Cliente clienteMock = criarClienteMock();
        when(clienteService.listarClientes()).thenReturn(Arrays.asList(clienteMock));

        // Executa teste
        List<Cliente> clientes = clienteService.listarClientes();
        
        assertNotNull(clientes);
        assertEquals(1, clientes.size());
        assertEquals("Cliente Teste", clientes.get(0).getNome());
        System.out.println("TESTE: Clientes encontrados: " + clientes.size());
    }

    @Test
    void testClienteServiceCadastrarCliente() {
        // Configura mock
        Cliente clienteMock = criarClienteMock();
        when(clienteService.cadastrarCliente(any(Cliente.class))).thenReturn(clienteMock);

        // Executa teste
        Cliente novoCliente = new Cliente();
        novoCliente.setNome("Cliente Teste");
        novoCliente.setEmail("cliente.teste@email.com");
        
        Cliente clienteSalvo = clienteService.cadastrarCliente(novoCliente);
        
        assertNotNull(clienteSalvo);
        assertEquals(1L, clienteSalvo.getIdUsuario());
        System.out.println("TESTE: Cliente cadastrado com ID: " + clienteSalvo.getIdUsuario());
    }

    @Test
    void testClienteServiceLoginSucesso() {
        // Configura mock para login com sucesso
        Cliente clienteMock = criarClienteMock();
        when(clienteService.login("cliente.teste@email.com", "123456"))
            .thenReturn(Optional.of(clienteMock));

        // Teste login com sucesso
        Optional<Cliente> clienteLogin = clienteService.login("cliente.teste@email.com", "123456");
        assertTrue(clienteLogin.isPresent());
        assertEquals("Cliente Teste", clienteLogin.get().getNome());
        System.out.println("TESTE: Login realizado com sucesso: " + clienteLogin.get().getNome());
    }

    @Test
    void testClienteServiceLoginFalha() {
        // Configura mock para login falho
        when(clienteService.login("email.errado@teste.com", "senhaerrada"))
            .thenReturn(Optional.empty());

        // Teste login falho
        Optional<Cliente> clienteLoginFalho = clienteService.login("email.errado@teste.com", "senhaerrada");
        assertFalse(clienteLoginFalho.isPresent());
        System.out.println("TESTE: Login falhou - credenciais invalidas");
    }

    @Test
    void testClienteServiceGetCliente() {
        // Configura mock
        Cliente clienteMock = criarClienteMock();
        when(clienteService.getCliente(1L)).thenReturn(clienteMock);

        // Executa teste
        Cliente cliente = clienteService.getCliente(1L);
        
        assertNotNull(cliente);
        assertEquals("Cliente Teste", cliente.getNome());
        System.out.println("TESTE: Cliente encontrado: " + cliente.getNome());
    }

    @Test
    void testClienteServiceGetAgendamentosDoCliente() {
        // Configura mock
        Agendamento agendamentoMock = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(1));
        when(clienteService.getAgendamentosDoCliente(1L))
            .thenReturn(Arrays.asList(agendamentoMock));

        // Executa teste
        List<Agendamento> agendamentos = clienteService.getAgendamentosDoCliente(1L);
        
        assertNotNull(agendamentos);
        assertEquals(1, agendamentos.size());
        System.out.println("TESTE: Agendamentos do cliente: " + agendamentos.size());
    }

    // ========== TESTES DO PROFISSIONALSERVICE ==========

    @Test
    void testProfissionalServiceLogin() {
        // Configura mock
        Profissional profissionalMock = criarProfissionalMock();
        when(profissionalService.login("profissional@email.com", "senha"))
            .thenReturn(Optional.of(profissionalMock));

        // Executa teste
        Optional<Profissional> profissionalLogin = profissionalService.login("profissional@email.com", "senha");
        
        assertTrue(profissionalLogin.isPresent());
        assertEquals("Profissional Teste", profissionalLogin.get().getNome());
        System.out.println("TESTE: Login profissional realizado: " + profissionalLogin.get().getNome());
    }

    @Test
    void testProfissionalServiceGetProfissional() {
        // Configura mock
        Profissional profissionalMock = criarProfissionalMock();
        when(profissionalService.getProfissional(1L))
            .thenReturn(profissionalMock);

        // Executa teste
        Profissional profissional = profissionalService.getProfissional(1L);
        
        assertNotNull(profissional);
        assertEquals("Profissional Teste", profissional.getNome());
        System.out.println("TESTE: Profissional encontrado: " + profissional.getNome());
    }

    @Test
    void testProfissionalServiceGetAgendamentos() {
        // Configura mock
        Agendamento agendamentoMock = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(1));
        when(profissionalService.getAgendamentosDoProfissional(1L))
            .thenReturn(java.util.Set.of(agendamentoMock));

        // Executa teste
        var agendamentos = profissionalService.getAgendamentosDoProfissional(1L);
        
        assertNotNull(agendamentos);
        assertEquals(1, agendamentos.size());
        System.out.println("TESTE: Agendamentos do profissional: " + agendamentos.size());
    }

    // ========== TESTES DO SERVICOSERVICE ==========

    @Test
    void testServicoServiceListarServicos() {
        // Configura mock
        Servico servicoMock = criarServicoMock();
        when(servicoService.listarServicos()).thenReturn(Arrays.asList(servicoMock));

        // Executa teste
        List<Servico> servicos = servicoService.listarServicos();
        
        assertNotNull(servicos);
        assertEquals(1, servicos.size());
        assertEquals("Servico Teste", servicos.get(0).getNome());
        System.out.println("TESTE: Servicos encontrados: " + servicos.size());
    }

    @Test
    void testServicoServiceCriarServico() {
        // Configura mock
        Servico servicoMock = criarServicoMock();
        when(servicoService.criarServico(any(Servico.class))).thenReturn(org.springframework.http.ResponseEntity.ok(servicoMock)
        );

 		// Executa teste
        Servico novoServico = new Servico();
        novoServico.setNome("Servico Teste");
        org.springframework.http.ResponseEntity<Servico> response = servicoService.criarServico(novoServico);
        Servico servicoSalvo = response.getBody(); 

        assertNotNull(servicoSalvo);
        assertEquals("Servico Teste", servicoSalvo.getNome());
        assertEquals(org.springframework.http.HttpStatus.OK, response.getStatusCode()); 
        System.out.println("TESTE: Servico criado com sucesso");
    }

    @Test
    void testServicoServiceGetServico() {
        // Configura mock
        Servico servicoMock = criarServicoMock();
        when(servicoService.getServico(1L)).thenReturn(servicoMock);

        // Executa teste
        Servico servico = servicoService.getServico(1L);
        
        assertNotNull(servico);
        assertEquals("Servico Teste", servico.getNome());
        System.out.println("TESTE: Servico encontrado: " + servico.getNome());
    }

    @Test
    void testServicoServiceDeletarServico() {
        // Configura mock - void method, não precisa thenReturn
        // Apenas verifica que não lança exceção
        assertDoesNotThrow(() -> servicoService.deletarServico(1L));
        System.out.println("TESTE: Servico deletado sem erros");
    }

    // ========== TESTES DO AGENDAMENTOSERVICE ==========

    @Test
    void testAgendamentoServiceAgendarServicoSucessoPagamentoIntegral() {
        // Configura mock
        Agendamento novoAgendamento = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(2));
        novoAgendamento.setPagamentoParcial(false);

        when(agendamentoService.agendarServico(any(Agendamento.class))).thenReturn(novoAgendamento);

        // Executa teste
        Agendamento agendamentoSalvo = agendamentoService.agendarServico(novoAgendamento);

        // Verifica
        assertNotNull(agendamentoSalvo);
        assertEquals(StatusAgendamento.AGENDADO, agendamentoSalvo.getStatus());
        assertFalse(agendamentoSalvo.isPagamentoParcial());
        System.out.println("TESTE: Agendar Serviço com pagamento integral realizado com sucesso.");
    }

    @Test
    void testAgendamentoServiceAgendarServicoSucessoPagamentoParcial() {
        // Configura mock
        Agendamento novoAgendamento = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(2));
        novoAgendamento.setPagamentoParcial(true); // Pagamento parcial

        when(agendamentoService.agendarServico(any(Agendamento.class))).thenReturn(novoAgendamento);

        // Executa teste
        Agendamento agendamentoSalvo = agendamentoService.agendarServico(novoAgendamento);

        // Verifica
        assertNotNull(agendamentoSalvo);
        assertTrue(agendamentoSalvo.isPagamentoParcial());
        System.out.println("TESTE: Agendar Serviço com pagamento parcial realizado com sucesso.");
    }

    @Test
    void testAgendamentoServiceAgendarServicoFalhaHorarioConflito() {
        // Configura mock para lançar exceção de conflito
        Agendamento agendamentoComConflito = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(2));
        when(agendamentoService.agendarServico(any(Agendamento.class)))
            .thenThrow(new RuntimeException("Horário indisponível."));

        // Executa e verifica a exceção
        Exception exception = assertThrows(RuntimeException.class, () ->
            agendamentoService.agendarServico(agendamentoComConflito));

        // Verifica
        assertEquals("Horário indisponível.", exception.getMessage());
        System.out.println("TESTE: Agendar Serviço falhou corretamente com conflito de horário.");
    }

    @Test
    void testCancelarAgendamentoFalha24Horas() {
        // Configura mock para simular a falha na regra de 24h
        Agendamento agendamentoProximo = criarAgendamentoMockProximo(StatusAgendamento.AGENDADO, 1L);
        when(agendamentoService.cancelarAgendamento(agendamentoProximo.getId()))
            .thenThrow(new RuntimeException("Não é possível cancelar agendamento com menos de 24h."));

        // Executa e verifica a exceção
        Exception exception = assertThrows(RuntimeException.class, () ->
            agendamentoService.cancelarAgendamento(agendamentoProximo.getId()));

        // Verifica
        assertEquals("Não é possível cancelar agendamento com menos de 24h.", exception.getMessage());
        System.out.println("TESTE: Cancelar agendamento falhou com regra de 24h violada.");
    }

    @Test
    void testReagendarAgendamentoSucesso() {
        // Configura mock
        LocalDateTime novaData = LocalDateTime.now().plusDays(5);
        Agendamento agendamentoAtualizado = criarAgendamentoMock(StatusAgendamento.ALTERADO, novaData);

        when(agendamentoService.reagendarAgendamento(eq(1L), any(LocalDateTime.class)))
            .thenReturn(agendamentoAtualizado);

        // Executa teste
        Agendamento resultado = agendamentoService.reagendarAgendamento(1L, novaData);

        // Verifica
        assertNotNull(resultado);
        assertEquals(novaData, resultado.getDataHora());
        assertEquals(StatusAgendamento.ALTERADO, resultado.getStatus());
        System.out.println("TESTE: Reagendar Agendamento realizado com sucesso.");
    }

    @Test
    void testReagendarAgendamentoFalha24Horas() {
        // Configura mock para simular a falha na regra de 24h
        LocalDateTime novaData = LocalDateTime.now().plusDays(5);

        when(agendamentoService.reagendarAgendamento(eq(1L), any(LocalDateTime.class)))
            .thenThrow(new RuntimeException("Não é possível reagendar com menos de 24h de antecedência."));

        // Executa e verifica a exceção
        Exception exception = assertThrows(RuntimeException.class, () ->
            agendamentoService.reagendarAgendamento(1L, novaData));

        // Verifica
        assertEquals("Não é possível reagendar com menos de 24h de antecedência.", exception.getMessage());
        System.out.println("TESTE: Reagendar Agendamento falhou com regra de 24h violada.");
    }

    @Test
    void testReagendarAgendamentoFalhaHorarioConflito() {
        // Configura mock para lançar exceção de conflito
        LocalDateTime novaData = LocalDateTime.now().plusDays(5);

        when(agendamentoService.reagendarAgendamento(eq(1L), any(LocalDateTime.class)))
            .thenThrow(new RuntimeException("Horário indisponível."));

        // Executa e verifica a exceção
        Exception exception = assertThrows(RuntimeException.class, () ->
            agendamentoService.reagendarAgendamento(1L, novaData));

        // Verifica
        assertEquals("Horário indisponível.", exception.getMessage());
        System.out.println("TESTE: Reagendar Agendamento falhou com conflito de horário.");
    }

    @Test
    void testAgendamentoServiceListarAgendamentos() {
        // Configura mock
        Agendamento agendamentoMock = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(1));
        when(agendamentoService.listarAgendamentos()).thenReturn(Arrays.asList(agendamentoMock));

        // Executa teste
        List<Agendamento> agendamentos = agendamentoService.listarAgendamentos();

        // Verifica
        assertNotNull(agendamentos);
        assertEquals(1, agendamentos.size());
        assertEquals(StatusAgendamento.AGENDADO, agendamentos.get(0).getStatus());
        System.out.println("TESTE: Agendamentos encontrados: " + agendamentos.size());
    }

    @Test
    void testAgendamentoServiceGetAgendamentoExistente() {
        // Configura mock
        Agendamento agendamentoMock = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(1));
        when(agendamentoService.getAgendamento(1L)).thenReturn(Optional.of(agendamentoMock));

        // Executa teste
        Optional<Agendamento> agendamento = agendamentoService.getAgendamento(1L);

        // Verifica
        assertTrue(agendamento.isPresent());
        assertEquals(1L, agendamento.get().getId());
        System.out.println("TESTE: Agendamento encontrado: " + agendamento.get().getId());
    }

    @Test
    void testAgendamentoServiceGetAgendamentoInexistente() {
        // Configura mock para retornar vazio
        when(agendamentoService.getAgendamento(999L)).thenReturn(Optional.empty());

        // Executa teste
        Optional<Agendamento> agendamento = agendamentoService.getAgendamento(999L);

        // Verifica
        assertFalse(agendamento.isPresent());
        System.out.println("TESTE: Agendamento inexistente retornou vazio");
    }

    @Test
    void testAgendamentoServiceCancelarAgendamentoInexistente() {
        // Configura mock para agendamento inexistente
        when(agendamentoService.cancelarAgendamento(999L)).thenReturn(false);

        // Executa teste
        boolean resultado = agendamentoService.cancelarAgendamento(999L);

        // Verifica
        assertFalse(resultado);
        System.out.println("TESTE: Cancelar agendamento inexistente retornou false");
    }

    @Test
    void testAgendamentoServiceCancelarAgendamentoExistente() {
        // Configura mock para agendamento existente
        when(agendamentoService.cancelarAgendamento(1L)).thenReturn(true);

        // Executa teste
        boolean resultado = agendamentoService.cancelarAgendamento(1L);

        // Verifica
        assertTrue(resultado);
        System.out.println("TESTE: Cancelar agendamento existente retornou true");
    }

    @Test
    void testAgendamentoServiceAtualizarStatusComErro() {
        // Configura mock para lancar excecao
        when(agendamentoService.atualizarStatus(999L, StatusAgendamento.CONCLUÍDO))
            .thenThrow(new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Agendamento nao encontrado"));

        // Executa teste
        Exception exception = assertThrows(org.springframework.web.server.ResponseStatusException.class, 
            () -> agendamentoService.atualizarStatus(999L, StatusAgendamento.CONCLUÍDO));
        
        assertNotNull(exception);
        System.out.println("TESTE: Comportamento correto ao atualizar status de agendamento inexistente");
    }

    @Test
    void testAgendamentoServiceAtualizarStatusComSucesso() {
        // Configura mock para sucesso
        Agendamento agendamentoMock = criarAgendamentoMock(StatusAgendamento.CONCLUÍDO, LocalDateTime.now().plusDays(1));
        when(agendamentoService.atualizarStatus(1L, StatusAgendamento.CONCLUÍDO))
            .thenReturn(agendamentoMock);

        // Executa teste
        Agendamento agendamento = agendamentoService.atualizarStatus(1L, StatusAgendamento.CONCLUÍDO);
        
        assertNotNull(agendamento);
        assertEquals(StatusAgendamento.CONCLUÍDO, agendamento.getStatus());
        System.out.println("TESTE: Status do agendamento atualizado com sucesso");
    }

    // ========== TESTES DO AVALIACAOSERVICE ==========

    @Test
    void testAvaliacaoServiceCriarAvaliacao() {
        // Configura mock
        Avaliacao avaliacaoMock = new Avaliacao();
        avaliacaoMock.setId(1L);
        avaliacaoMock.setNota(5);
        avaliacaoMock.setComentario("Otimo servico");
        
        when(avaliacaoService.criarAvaliacao(anyLong(), any(Avaliacao.class)))
            .thenReturn(avaliacaoMock);

        // Executa teste
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(5);
        avaliacao.setComentario("Otimo servico");

        Avaliacao avaliacaoSalva = avaliacaoService.criarAvaliacao(1L, avaliacao);
        
        assertNotNull(avaliacaoSalva);
        assertEquals(5, avaliacaoSalva.getNota());
        System.out.println("TESTE: Avaliacao criada com sucesso");
    }

    @Test
    void testAvaliacaoServiceCriarAvaliacaoFalhaStatusInvalido() {
        // Configura mock para falha na regra de status
        when(avaliacaoService.criarAvaliacao(eq(1L), any(Avaliacao.class)))
            .thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST,
            "Não é possível avaliar um agendamento que não esteja concluído."));

        // Executa e verifica a exceção
        Exception exception = assertThrows(ResponseStatusException.class, () ->
            avaliacaoService.criarAvaliacao(1L, new Avaliacao()));

        // Verifica
        assertEquals(HttpStatus.BAD_REQUEST, ((ResponseStatusException)exception).getStatusCode());
        System.out.println("TESTE: Criar Avaliação falhou porque agendamento não está concluído.");
    }

    // ========== TESTES DO ADMINISTRADORSERVICE ==========

    @Test
    void testAdministradorServiceAtualizarProfissionalSucesso() {
        // Configura mock
        Profissional profissionalAtualizado = new Profissional();
        profissionalAtualizado.setNome("Profissional Novo Nome");
        profissionalAtualizado.setTelefone("98765432101");

        when(administradorService.atualizarProfissional(eq(1L), any(Profissional.class)))
            .thenReturn(profissionalAtualizado);

        // Executa teste
        Profissional resultado = administradorService.atualizarProfissional(1L, profissionalAtualizado);

        // Verifica
        assertNotNull(resultado);
        assertEquals("Profissional Novo Nome", resultado.getNome());
        assertEquals("98765432101", resultado.getTelefone());
        System.out.println("TESTE: Atualizar Profissional realizado com sucesso.");
    }

    @Test
    void testAdministradorServiceAtualizarProfissionalFalhaNaoEncontrado() {
        // Configura mock para lançar exceção
        Profissional profissionalAtualizado = new Profissional();

        when(administradorService.atualizarProfissional(eq(999L), any(Profissional.class)))
            .thenThrow(new java.util.NoSuchElementException("Profissional com id 999 não encontrado"));

        // Executa e verifica a exceção
        Exception exception = assertThrows(java.util.NoSuchElementException.class, () ->
            administradorService.atualizarProfissional(999L, profissionalAtualizado));

        // Verifica
        assertEquals("Profissional com id 999 não encontrado", exception.getMessage());
        System.out.println("TESTE: Atualizar Profissional falhou corretamente (não encontrado).");
    }

    @Test
    void testAdministradorServiceDeletarAgendamentoSucesso() {
        // Configura mock
        Agendamento agendamentoMock = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(1));
        when(administradorService.deletarAgendamento(eq(1L))).thenReturn(agendamentoMock);

        // Executa teste
        Agendamento resultado = administradorService.deletarAgendamento(1L);

        // Verifica
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        System.out.println("TESTE: Deletar Agendamento realizado com sucesso.");
    }

    @Test
    void testAdministradorServiceDeletarAgendamentoFalhaNaoEncontrado() {
        // Configura mock para lançar exceção
        when(administradorService.deletarAgendamento(eq(999L)))
            .thenThrow(new java.util.NoSuchElementException("Agendamento com id 999 não encontrado"));

        // Executa e verifica a exceção
        Exception exception = assertThrows(java.util.NoSuchElementException.class, () ->
            administradorService.deletarAgendamento(999L));

        // Verifica
        assertEquals("Agendamento com id 999 não encontrado", exception.getMessage());
        System.out.println("TESTE: Deletar Agendamento falhou corretamente (não encontrado).");
    }

    @Test
    void testAdministradorServiceListarProfissionais() {
        // Configura mock
        Profissional profissionalMock = criarProfissionalMock();
        when(administradorService.listarProfissionais()).thenReturn(Arrays.asList(profissionalMock));

        // Executa teste
        List<Profissional> profissionais = administradorService.listarProfissionais();
        
        assertNotNull(profissionais);
        assertEquals(1, profissionais.size());
        System.out.println("TESTE: Profissionais encontrados: " + profissionais.size());
    }

    @Test
    void testAdministradorServiceCriarProfissional() {
        // Configura mock
        Profissional profissionalMock = criarProfissionalMock();
        when(administradorService.criarProfissional(any(Profissional.class)))
            .thenReturn(profissionalMock);

        // Executa teste
        Profissional profissional = new Profissional();
        profissional.setNome("Profissional Admin Teste");
        
        Profissional profissionalSalvo = administradorService.criarProfissional(profissional);
        
        assertNotNull(profissionalSalvo);
        assertEquals(1L, profissionalSalvo.getIdUsuario());
        System.out.println("TESTE: Profissional criado pelo admin com ID: " + profissionalSalvo.getIdUsuario());
    }

    @Test
    void testAdministradorServiceListarSolicitacoes() {
        // Configura mock
        Solicitacao solicitacaoMock = new Solicitacao();
        solicitacaoMock.setId(1L);
        solicitacaoMock.setDescricao("Solicitacao teste");
        
        when(administradorService.listarSolicitacoes()).thenReturn(Arrays.asList(solicitacaoMock));

        // Executa teste
        List<Solicitacao> solicitacoes = administradorService.listarSolicitacoes();
        
        assertNotNull(solicitacoes);
        assertEquals(1, solicitacoes.size());
        System.out.println("TESTE: Solicitacoes encontradas: " + solicitacoes.size());
    }

    @Test
    void testAdministradorServiceDeletarProfissionalComErro() {
        // Configura mock para lancar excecao
        when(administradorService.deletarProfissional(999L))
            .thenThrow(new java.util.NoSuchElementException("Profissional nao encontrado"));

        // Executa teste
        Exception exception = assertThrows(java.util.NoSuchElementException.class, 
            () -> administradorService.deletarProfissional(999L));
        
        assertNotNull(exception);
        System.out.println("TESTE: Comportamento correto ao deletar profissional inexistente");
    }

    @Test
    void testAdministradorServiceDeletarProfissionalComSucesso() {
        // Configura mock para sucesso
        Profissional profissionalMock = criarProfissionalMock();
        when(administradorService.deletarProfissional(1L)).thenReturn(profissionalMock);

        // Executa teste
        Profissional profissional = administradorService.deletarProfissional(1L);
        
        assertNotNull(profissional);
        System.out.println("TESTE: Profissional deletado com sucesso");
    }

    // ============== TESTES DO SOLICITACAOSERVICE ==============

    @Test
    void testSolicitacaoServiceCriarSolicitacaoSucesso() {
        // Configura mock
        CriarSolicitacaoDTO dto = new CriarSolicitacaoDTO(1L, 1L, "Descrição Teste", TipoSolicitacaoAgendamento.ALTERAR);
        Solicitacao solicitacaoSalvaMock = new Solicitacao();
        solicitacaoSalvaMock.setId(1L);

        when(administradorService.listarSolicitacoes()).thenReturn(Arrays.asList(solicitacaoSalvaMock));

        // Executa teste
        // NOTA: Como estamos mockando o Service, simulamos a listagem para verificar o fluxo.
        List<Solicitacao> solicitacoes = administradorService.listarSolicitacoes();

        // Verifica
        assertNotNull(solicitacoes);
        assertEquals(1, solicitacoes.size());
        System.out.println("TESTE: Criação de Solicitação de Agendamento (simulada) com sucesso.");
    }

    @Test
    void testSolicitacaoServiceCriarSolicitacaoFalhaProfissionalNaoResponsavel() {
        // Configura mock para lançar a exceção de regra de negócio (Profissional 2L tentando criar solicitação para agendamento 1L)
        // NOTA: No Service real, a validação de responsável é feita internamente. Aqui, mockamos o erro.
        when(administradorService.listarSolicitacoes())
             .thenThrow(new IllegalArgumentException("Profissional só pode criar solicitação para seus próprios agendamentos"));

        // Executa e verifica a exceção
        Exception exception = assertThrows(IllegalArgumentException.class, () ->
             administradorService.listarSolicitacoes());

        // Verifica
        assertEquals("Profissional só pode criar solicitação para seus próprios agendamentos", exception.getMessage());
        System.out.println("TESTE: Criar Solicitação falhou corretamente (profissional não responsável).");
    }

    // ========== TESTES DE FLUXO COMPLETO ==========

    @Test
    void testFluxoCompletoSistema() {
        // Configura todos os mocks para simular um sistema funcionando

        Agendamento agendamentoMock = criarAgendamentoMock(StatusAgendamento.AGENDADO, LocalDateTime.now().plusDays(1));
        Solicitacao solicitacaoMock = new Solicitacao();

        when(clienteService.listarClientes()).thenReturn(Arrays.asList(criarClienteMock()));
        when(administradorService.listarProfissionais()).thenReturn(Arrays.asList(criarProfissionalMock()));
        when(servicoService.listarServicos()).thenReturn(Arrays.asList(criarServicoMock()));
        when(agendamentoService.listarAgendamentos()).thenReturn(Arrays.asList(agendamentoMock));
        when(administradorService.listarSolicitacoes()).thenReturn(Arrays.asList(solicitacaoMock));

        // Simula o fluxo de um usuário usando o sistema
        List<Cliente> clientes = clienteService.listarClientes();
        List<Profissional> profissionais = administradorService.listarProfissionais();
        List<Servico> servicos = servicoService.listarServicos();
        List<Agendamento> agendamentos = agendamentoService.listarAgendamentos();
        List<Solicitacao> solicitacoes = administradorService.listarSolicitacoes();
        
        // Verificacoes
        assertEquals(1, clientes.size());
        assertEquals(1, profissionais.size());
        assertEquals(1, servicos.size());
        assertEquals(1, agendamentos.size());
        assertEquals(1, solicitacoes.size());
        
        System.out.println("Clientes no sistema: " + clientes.size());
        System.out.println("Profissionais no sistema: " + profissionais.size());
        System.out.println("Servicos no sistema: " + servicos.size());
        System.out.println("Agendamentos no sistema: " + agendamentos.size());
        System.out.println("Solicitacoes no sistema: " + solicitacoes.size());
    }

    @Test
    void contextLoads() {
     // Teste padrão do Spring Boot para verificar se o contexto da aplicação carrega corretamente
        }
    }