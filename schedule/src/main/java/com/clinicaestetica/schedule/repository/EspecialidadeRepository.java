package com.clinicaestetica.schedule.repository;

import com.clinicaestetica.schedule.model.Especialidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspecialidadeRepository extends JpaRepository<Especialidade, Long> {
}