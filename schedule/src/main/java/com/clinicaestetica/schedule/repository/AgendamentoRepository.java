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

    boolean existsByProfissionalIdUsuarioAndDataHoraAndStatusNot(
            Long profissionalId,
            LocalDateTime dataHora,
            StatusAgendamento statusIgnorar
    );

    @Query("SELECT a FROM Agendamento a WHERE a.cliente.idUsuario = :clienteId " +
           "AND a.dataHora > :dataAtual " +
           "AND (a.status = :statusAgendado OR a.status = :statusAlterado) " + 
           "ORDER BY a.dataHora ASC")
    List<Agendamento> findAgendamentosFuturos(@Param("clienteId") Long clienteId, 
                                             @Param("dataAtual") LocalDateTime dataAtual,
                                             @Param("statusAgendado") StatusAgendamento statusAgendado,    // MUDADO AQUI
                                             @Param("statusAlterado") StatusAgendamento statusAlterado); // MUDADO AQUI


    @Query("SELECT a FROM Agendamento a WHERE a.cliente.idUsuario = :clienteId " +
           "AND (a.dataHora <= :dataAtual OR a.status = :statusConcluido OR a.status = :statusCancelado) " + // MUDADO AQUI
           "ORDER BY a.dataHora DESC")
    List<Agendamento> findAgendamentosPassados(@Param("clienteId") Long clienteId, 
                                             @Param("dataAtual") LocalDateTime dataAtual,
                                             @Param("statusConcluido") StatusAgendamento statusConcluido,  // MUDADO AQUI
                                             @Param("statusCancelado") StatusAgendamento statusCancelado); // MUDADO AQUI

    @Query("SELECT a FROM Agendamento a WHERE a.cliente.idUsuario = :clienteId ORDER BY a.dataHora DESC")
    List<Agendamento> findByClienteIdUsuario(@Param("clienteId") Long clienteId);

    List<Agendamento> findByStatus(StatusAgendamento status);


    List<Agendamento> findByProfissionalIdUsuarioAndStatus(Long profissionalId, StatusAgendamento status);


    List<Agendamento> findByServicoId(Long servicoId);


    List<Agendamento> findByProfissionalIdUsuario(Long profissionalId);
    
}