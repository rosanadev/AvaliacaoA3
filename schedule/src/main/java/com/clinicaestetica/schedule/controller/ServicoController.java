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
import java.util.Optional;

@RestController // Esta anotação diz ao Spring que esta classe é uma API que irá responder a requisições web.
@RequestMapping("/servicos") //Define o endereço base da nossa API. Todos os métodos nesta classe estarão sob o caminho /servicos
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping // Esta anotação, sem nenhum parâmetro, diz que o método listarServicos() será executado quando alguém fizer uma requisição GET para o endereço base da nossa API, que é /servicos
    public List<Servico> listarServicos() { //Este método chama a nossa lógica de negócio (servicoService) e retorna a lista de serviços que o banco de dados enviou.
        return servicoService.listarServicos(); 
    }

    @PostMapping
    public ResponseEntity<Servico> criarServico(@RequestBody Servico servico) {
        return servicoService.criarServico(servico);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servico> obterServicoPorId(@PathVariable Long id) {
        Optional<Servico> servicoOptional = servicoService.getServico(id);
        return servicoOptional.map(
            servico -> new ResponseEntity<>(servico, HttpStatus.OK))
            .orElseGet(()-> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarServico(@PathVariable Long id) {
        Optional<Servico> servicoOptional = servicoService.getServico(id);
        if (servicoOptional.isPresent()) {
            servicoService.deletarServico(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}