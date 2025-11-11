package com.clinicaestetica.schedule.repository;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    //Verificar se já existe agendamento no mesmo horário para o profissional
    boolean existsByProfissionalIdUsuarioAndDataHoraAndStatusNotAndIdNot(
        Long profissionalId,
        LocalDateTime dataHora,
        StatusAgendamento statusIgnorar,
        Long agendamentoId
    );

    @Query("SELECT a FROM Agendamento a WHERE a.cliente.idUsuario = :clienteId AND a.dataHora > :dataAtual ORDER BY a.dataHora ASC")
    List<Agendamento> findAgendamentosFuturos(@Param("clienteId") Long clienteId, @Param("dataAtual") LocalDateTime dataAtual);

    //  Buscar agendamentos passados de um cliente
    @Query("SELECT a FROM Agendamento a WHERE a.cliente.idUsuario = :clienteId AND a.dataHora <= :dataAtual ORDER BY a.dataHora DESC")
    List<Agendamento> findAgendamentosPassados(@Param("clienteId") Long clienteId, @Param("dataAtual") LocalDateTime dataAtual);

    //Buscar agendamentos por status
    List<Agendamento> findByStatus(StatusAgendamento status);

    //Buscar agendamentos por profissional e status
    List<Agendamento> findByProfissionalIdUsuarioAndStatus(Long profissionalId, StatusAgendamento status);
}