package com.clinicaestetica.schedule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.service.ProfissionalService;
import com.clinicaestetica.schedule.model.Agendamento;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {
    @Autowired
    private ProfissionalService profissionalService;

    @PostMapping
    public Profissional criarProfissional(@RequestBody Profissional profissional) {
        return profissionalService.criarProfissional(profissional);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> getProfissional(@PathVariable long id) {
        Profissional profissional = profissionalService.getProfissional(id);
        return new ResponseEntity<>(profissional, HttpStatus.OK);
    }

}
 