package com.clinicaestetica.schedule.controller;

import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.model.Solicitacao;
import com.clinicaestetica.schedule.service.AdministradorService;

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
    
}
