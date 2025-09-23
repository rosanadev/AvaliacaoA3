package com.clinicaestetica.schedule.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.clinicaestetica.schedule.enums.StatusAgendamento;
import com.clinicaestetica.schedule.model.Agendamento;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    //Verificar se já existe agendamento no mesmo horário para o profissional
    boolean existsByProfissionalIdUsuarioAndDataHoraAndStatusNot(
            Long profissionalId,
            LocalDateTime dataHora,
            StatusAgendamento statusIgnorar
    );
}
