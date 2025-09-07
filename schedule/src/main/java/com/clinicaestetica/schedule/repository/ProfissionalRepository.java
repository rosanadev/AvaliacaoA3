package com.clinicaestetica.schedule.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.clinicaestetica.schedule.model.Profissional;

@Repository
public interface ProfissionalRepository extends JpaRepository<Profissional, Long>{

    Optional<Profissional> findByEmail(String email); //além do email, encontrar a senha

}
