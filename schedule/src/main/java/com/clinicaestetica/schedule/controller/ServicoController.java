package com.clinicaestetica.schedule.controller;

import com.clinicaestetica.schedule.model.Servico;
import com.clinicaestetica.schedule.service.ServicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController // Esta anotação diz ao Spring que esta classe é uma API que irá responder a requisições web.
@RequestMapping("/servicos") //Define o endereço base da nossa API. Todos os métodos nesta classe estarão sob o caminho /servicos
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @GetMapping // Esta anotação, sem nenhum parâmetro, diz que o método listarServicos() será executado quando alguém fizer uma requisição GET para o endereço base da nossa API, que é /servicos
    public List<Servico> listarServicos() { //Este método chama a nossa lógica de negócio (servicoService) e retorna a lista de serviços que o banco de dados enviou.
        return servicoService.listarServicos(); 
    }

}