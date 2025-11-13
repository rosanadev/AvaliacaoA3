package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Especialidade;
import com.clinicaestetica.schedule.service.EspecialidadeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/especialidades")
public class EspecialidadeController {

    @Autowired
    private EspecialidadeService especialidadeService;

    @PostMapping
    public ResponseEntity<Especialidade> criarEspecialidade(@RequestBody Especialidade especialidade) {
        Especialidade novaEspecialidade = especialidadeService.criarEspecialidade(especialidade);
        return new ResponseEntity<>(novaEspecialidade, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Especialidade>> listarEspecialidades() {
        List<Especialidade> especialidades = especialidadeService.listarEspecialidades();
        return new ResponseEntity<>(especialidades, HttpStatus.OK);
    }
}