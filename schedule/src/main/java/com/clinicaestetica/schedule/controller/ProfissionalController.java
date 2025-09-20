package com.clinicaestetica.schedule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.clinicaestetica.schedule.model.Profissional;
import com.clinicaestetica.schedule.service.ProfissionalService;

@RestController
@RequestMapping("/profissionais")
public class ProfissionalController {
    @Autowired
    private ProfissionalService profissionalService;

    @PostMapping
    public Profissional criarProfissional(@RequestBody Profissional profissional) {
        return profissionalService.criarProfissional(profissional);
    }
}
