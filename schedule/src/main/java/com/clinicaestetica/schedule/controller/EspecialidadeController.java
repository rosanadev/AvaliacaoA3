package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Especialidade;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.service.EspecialidadeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/especialidades")
public class EspecialidadeController {

    @Autowired
    private EspecialidadeService especialidadeService;

    @PostMapping
    public ResponseEntity<Especialidade> criarEspecialidade(@Valid @RequestBody Especialidade especialidade) {
        Especialidade novaEspecialidade = especialidadeService.criarEspecialidade(especialidade);
        return new ResponseEntity<>(novaEspecialidade, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Especialidade>> listarEspecialidades() {
        List<Especialidade> especialidades = especialidadeService.listarEspecialidades();
        return new ResponseEntity<>(especialidades, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Especialidade> buscarPorId(@PathVariable Long id) {
        try {
            Especialidade especialidade = especialidadeService.buscarPorId(id);
            return ResponseEntity.ok(especialidade);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Especialidade> atualizarEspecialidade(
            @PathVariable Long id,
            @RequestBody Especialidade especialidade) {
        try {
            Especialidade atualizada = especialidadeService.atualizarEspecialidade(id, especialidade);
            return ResponseEntity.ok(atualizada);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEspecialidade(@PathVariable Long id) {
        try {
            especialidadeService.deletarEspecialidade(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PutMapping("/{especialidadeId}/servicos/{servicoId}")
    public ResponseEntity<Especialidade> associarServico(
            @PathVariable Long especialidadeId,
            @PathVariable Long servicoId) {
        try {
            Especialidade especialidade = especialidadeService.associarServico(especialidadeId, servicoId);
            return ResponseEntity.ok(especialidade);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{especialidadeId}/servicos/{servicoId}")
    public ResponseEntity<Especialidade> desassociarServico(
            @PathVariable Long especialidadeId,
            @PathVariable Long servicoId) {
        try {
            Especialidade especialidade = especialidadeService.desassociarServico(especialidadeId, servicoId);
            return ResponseEntity.ok(especialidade);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{especialidadeId}/profissionais/{profissionalId}")
    public ResponseEntity<Profissional> associarProfissional(
            @PathVariable Long especialidadeId,
            @PathVariable Long profissionalId) {
        try {
            Profissional profissional = especialidadeService.associarProfissional(especialidadeId, profissionalId);
            return ResponseEntity.ok(profissional);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{especialidadeId}/profissionais/{profissionalId}")
    public ResponseEntity<Profissional> desassociarProfissional(
            @PathVariable Long especialidadeId,
            @PathVariable Long profissionalId) {
        try {
            Profissional profissional = especialidadeService.desassociarProfissional(especialidadeId, profissionalId);
            return ResponseEntity.ok(profissional);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}