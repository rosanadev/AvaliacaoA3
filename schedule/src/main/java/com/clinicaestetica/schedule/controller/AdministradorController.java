package com.clinicaestetica.schedule.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.model.Administrador;
import com.clinicaestetica.schedule.model.Agendamento;
import com.clinicaestetica.schedule.service.AdministradorService;
import com.clinicaestetica.schedule.enums.StatusSolicitacao;

@RestController
@RequestMapping("/administrador")

public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @GetMapping ("/solicitacoes")
    public ResponseEntity<List<Solicitacao>> listarSolicitacoes(){

        try{
            List<Solicitacao> solicitacoes = administradorService.listarSolicitacoes();
                return ResponseEntity.ok(solicitacoes);
        } catch(Exception e){
            return ResponseEntity.internalServerError().build();
        }

    }

    @GetMapping("/calendario")
    public ResponseEntity<Map<String, List<Agendamento>>> getCalendarioCompleto(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        try {
            Map<String, List<Agendamento>> calendario = administradorService.getCalendarioCompleto(dataInicio, dataFim);
            return ResponseEntity.ok(calendario);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // NOVO: Calendário de um profissional específico
    @GetMapping("/calendario/profissional/{profissionalId}")
    public ResponseEntity<List<Agendamento>> getCalendarioProfissional(
            @PathVariable Long profissionalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        try {
            List<Agendamento> agendamentos = administradorService.getCalendarioProfissional(profissionalId, dataInicio, dataFim);
            return ResponseEntity.ok(agendamentos);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Administrador> login(@RequestBody Administrador administrador) {
        Optional<Administrador> adminOptional = administradorService.login(
            administrador.getEmail(), administrador.getSenha()
        );
    
        if (adminOptional.isPresent()) {
            return new ResponseEntity<>(adminOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/profissionais")
    public ResponseEntity<Profissional> criarProfissional(@RequestBody Profissional profissional) {
        try {
            Profissional novoProfissional = administradorService.criarProfissional(profissional);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoProfissional);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/profissionais/{id}")
    public ResponseEntity<Profissional> deletarProfissional(@PathVariable Long id) {
        try {
            Profissional profissional = administradorService.deletarProfissional(id);
            return ResponseEntity.ok(profissional);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/profissionais")
    public ResponseEntity<List<Profissional>> listarProfissionais() {
        try {
            List<Profissional> profissionais = administradorService.listarProfissionais();
            return ResponseEntity.ok(profissionais);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/profissionais/{id}")
    public ResponseEntity<Profissional> atualizarProfissional(@PathVariable Long id, @RequestBody Profissional profissionalAtualizado) {
        try {
            Profissional profissional = administradorService.atualizarProfissional(id, profissionalAtualizado);
            return ResponseEntity.ok(profissional);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
}

    @PatchMapping("/solicitacoes/{id}/status")
    public ResponseEntity<Solicitacao> processarSolicitacao(
            @PathVariable Long id,
            @RequestParam StatusSolicitacao novoStatus) {
        try {
            Solicitacao solicitacaoAtualizada = administradorService.processarSolicitacao(id, novoStatus);
            return ResponseEntity.ok(solicitacaoAtualizada);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            // Regra de negócio violada (ex: tentar mudar para PENDENTE, ou já foi processada)
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
            }
        }

    @PutMapping("/agendamentos/{id}")
    public ResponseEntity<Agendamento> atualizarAgendamentoDireto(@PathVariable Long id, @RequestBody Agendamento agendamentoAtualizado) {
        try {
            Agendamento agendamento = administradorService.atualizarAgendamentoDireto(id, agendamentoAtualizado);
            return ResponseEntity.ok(agendamento);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/agendamentos/{id}")
    public ResponseEntity<Void> deletarAgendamento(@PathVariable Long id) {
        try {
            administradorService.deletarAgendamento(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
