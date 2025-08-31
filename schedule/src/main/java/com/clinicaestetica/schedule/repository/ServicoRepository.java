package com.clinicaestetica.schedule.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.clinicaestetica.schedule.model.Servico;

@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long>{

}
