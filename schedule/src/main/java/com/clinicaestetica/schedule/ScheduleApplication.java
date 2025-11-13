package com.clinicaestetica.schedule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.clinicaestetica.schedule.model.Administrador;
import com.clinicaestetica.schedule.repository.AdministradorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import java.time.LocalDate;

@SpringBootApplication
public class ScheduleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScheduleApplication.class, args);
	}

    @Bean
    public CommandLineRunner initAdmin(AdministradorRepository administradorRepository) {
        return args -> {
            String adminEmail = "admin@email.com";
            if (administradorRepository.findByEmail(adminEmail).isEmpty()) {
                System.out.println(">>> Criando administrador padrão...");
                Administrador admin = new Administrador(
                    "Admin Padrão",
                    "00000000000",
                    LocalDate.of(1990, 1, 1),
                    adminEmail,
                    "admin123", // A senha é "admin123"
                    "11999999999",
                    "01001000",
                    "Clinica",
                    "Centro",
                    "São Paulo",
                    "SP"
                );
                administradorRepository.save(admin);
                System.out.println(">>> Administrador criado: admin@email.com | senha: admin123");
            }
        };
    }
}