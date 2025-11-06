package com.clinicaestetica.schedule.service;
import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.repository.SolicitacaoRepository;
import com.clinicaestetica.schedule.repository.AgendamentoRepository;
import com.clinicaestetica.schedule.dto.CriarSolicitacaoDTO;
import com.clinicaestetica.schedule.enums.StatusSolicitacao;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.repository.ProfissionalRepository;
import com.clinicaestetica.schedule.model.Profissional;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private ProfissionalRepository profissionalRepository;


    public Solicitacao criarSolicitacaoAgendamento(CriarSolicitacaoDTO dto) {
        
        // Buscar agendamento
        Agendamento agendamento = agendamentoRepository.findById(dto.getAgendamentoId())
            .orElseThrow(() -> new NoSuchElementException("Agendamento " + dto.getAgendamentoId() + " não encontrado"));
        
        // Buscar profissional usando o ID do DTO
        Profissional profissional = profissionalRepository.findById(dto.getProfissionalId())
            .orElseThrow(() -> new NoSuchElementException("Profissional com ID " + dto.getProfissionalId() + " não encontrado"));

        // Validar se o profissional é responsável pelo agendamento
        if (!agendamento.getProfissional().getIdUsuario().equals(profissional.getIdUsuario())) {
            throw new IllegalArgumentException("Profissional só pode criar solicitação para seus próprios agendamentos");
        }

        // Criar solicitação
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setAgendamento(agendamento);
        solicitacao.setProfissional(profissional);
        solicitacao.setDescricao(dto.getDescricao());
        solicitacao.setDataCriacao(LocalDateTime.now());
        solicitacao.setTipo(dto.getTipo());
        solicitacao.setStatus(StatusSolicitacao.PENDENTE);

        return solicitacaoRepository.save(solicitacao);
    }

    public List<Solicitacao> listarSolicitacoes() {
        return solicitacaoRepository.findAll();
    }
}