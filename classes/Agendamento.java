package classes;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Agendamento {

    private Integer codigoAgendamento;
    private Cliente cliente;
    private Profissional profissional;
    private Servico servico;
    private Date dataHora;
    private int status; 

    private static List<Agendamento> agendamentos = new ArrayList<Agendamento>();
    private static Integer proximoCodigo = 1;

    
    public Agendamento(Integer codigoAgendamento, Cliente cliente, Profissional profissional, Servico servico, Date dataHora, int status) {
        this.codigoAgendamento = codigoAgendamento;
        this.cliente = cliente;
        this.profissional = profissional;
        this.servico = servico;
        this.dataHora = dataHora;
        this.status = status;
    }

    // Getters e Setters
    public Integer getCodigoAgendamento() {
        return codigoAgendamento;
    }

    public void setCodigoAgendamento(Integer codigoAgendamento) {
        this.codigoAgendamento = codigoAgendamento;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Profissional getProfissional() {
        return profissional;
    }

    public void setProfissional(Profissional profissional) {
        this.profissional = profissional;
    }

    public Servico getServico() {
        return servico;
    }

    public void setServico(Servico servico) {
        this.servico = servico;
    }

    public Date getDataHora() {
        return dataHora;
    }

    public void setDataHora(Date dataHora) {
        this.dataHora = dataHora;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }



    // Agendar com validação de conflito // Pedi ajuda ao gpt nessa parte, deem uma olhada por gentileza
    public void agendar() {
        for (int i = 0; i < agendamentos.size(); i++) {
            Agendamento a = agendamentos.get(i);

            if (a.getStatus() == 0 &&
                a.getProfissional().getCodigo().intValue() == this.getProfissional().getCodigo().intValue() &&
                a.getDataHora().getTime() == this.getDataHora().getTime()) {

                System.out.println("Horário indisponível.");
                return;
            }
        }

        this.codigoAgendamento = proximoCodigo;
        proximoCodigo = proximoCodigo + 1;
        this.status = 0;
        agendamentos.add(this);
        System.out.println("Agendamento realizado.");
    }

    // A regra de 24h também pedi ajuda ao gpt.
    public void cancelar() {
        Date agora = new Date();
        long limite = 24L * 60 * 60 * 1000; 

        if (this.getDataHora().getTime() - agora.getTime() < limite) {
            System.out.println("Cancelamento não permitido.");
            return;
        }

        this.status = 1;
        System.out.println("Agendamento cancelado.");
    }

    
    public void remarcar(Date novaDataHora) {
        Date agora = new Date();
        long limite = 24L * 60 * 60 * 1000;

        if (this.getDataHora().getTime() - agora.getTime() < limite) {
            System.out.println("Remarcação não permitida.");
            return;
        }

        for (int i = 0; i < agendamentos.size(); i++) {
            Agendamento a = agendamentos.get(i);

            if (a.getStatus() == 0 &&
                a.getProfissional().getCodigo().intValue() == this.getProfissional().getCodigo().intValue() &&
                a.getCodigoAgendamento().intValue() != this.getCodigoAgendamento().intValue() &&
                a.getDataHora().getTime() == novaDataHora.getTime()) {

                System.out.println("Horário não disponível.");
                return;
            }
        }

        this.setDataHora(novaDataHora);
        System.out.println("Agendamento remarcado para: " + this.getDataHora());
    }

   
    public static void listarAgendamentos() {
        if (agendamentos.size() == 0) {
            System.out.println("Nenhum agendamento encontrado.");
            return;
        }

        for (int i = 0; i < agendamentos.size(); i++) {
            Agendamento a = agendamentos.get(i);

            String nomeStatus;
            if (a.getStatus() == 0) {
                nomeStatus = "AGENDADO";
            } else {
                nomeStatus = "CANCELADO";
            }

            System.out.println(
                "Código: " + a.getCodigoAgendamento() +
                " | Cliente: " + a.getCliente().getNome() +
                " | Profissional: " + a.getProfissional().getNome() +
                " | Serviço: " + a.getServico().getNome() +
                " | Data/Hora: " + a.getDataHora() +
                " | Status: " + nomeStatus
            );
        }
    }
}
