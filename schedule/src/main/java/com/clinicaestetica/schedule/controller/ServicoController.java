package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.service.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import jakarta.validation.Valid;

@RestController // Esta anotação diz ao Spring que esta classe é uma API que irá responder a requisições web.
@RequestMapping("/servicos") //Define o endereço base da nossa API. Todos os métodos nesta classe estarão sob o caminho /servicos
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping // Esta anotação, sem nenhum parâmetro, diz que o método listarServicos() será executado quando alguém fizer uma requisição GET para o endereço base da nossa API, que é /servicos
    public ResponseEntity<List<Servico>> listarServicos() { //Este método chama a nossa lógica de negócio (servicoService) e retorna a lista de serviços que o banco de dados enviou.
        List<Servico> servicos = servicoService.listarServicos();
        return ResponseEntity.ok(servicos);
    }

    @PostMapping
    public ResponseEntity<Servico> criarServico(@Valid @RequestBody Servico servico) {
        Servico savedServico = servicoService.criarServico(servico);
        return new ResponseEntity<>(savedServico, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servico> obterServicoPorId(@PathVariable Long id) {
        // Agora o service lança a exceção, o ControllerAdvice a captura
        Servico servico = servicoService.getServico(id);
        return new ResponseEntity<>(servico, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarServico(@PathVariable Long id) {
        // Agora o service lança a exceção, o ControllerAdvice a captura
        servicoService.deletarServico(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
