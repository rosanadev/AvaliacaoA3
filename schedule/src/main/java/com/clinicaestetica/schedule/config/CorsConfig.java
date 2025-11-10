package com.clinicaestetica.schedule.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer{
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite todas as rotas
                .allowedOrigins("http://localhost:3000") // Permite requisições do React
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Métodos permitidos
                .allowedHeaders("*") // Permite todos os headers
                .allowCredentials(true); // Permite cookies/autenticação
    }
    
}
