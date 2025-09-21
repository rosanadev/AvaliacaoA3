package com.clinicaestetica.schedule.controller;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> getProfissional(@PathVariable Long id) {
        Profissional profissional = profissionalService.getProfissional(id);
        return new ResponseEntity<>(profissional, HttpStatus.OK);        
    }

    @PostMapping("/login")
    public ResponseEntity<Profissional> login(@RequestBody Profissional profissional) {
    Optional<Profissional> profissionalOptional = profissionalService.login(profissional.getEmail(),profissional.getSenha());
    
        if (profissionalOptional.isPresent()) {
            return new ResponseEntity<>(profissionalOptional.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profissional> getProfissional(@PathVariable long id) {
        Profissional profissional = profissionalService.getProfissional(id);
        return new ResponseEntity<>(profissional, HttpStatus.OK);
    }

}
 