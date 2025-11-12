package com.clinicaestetica.schedule.config; // Verifique se o nome do pacote está correto

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite CORS para todos os endpoints (/**)
            .allowedOrigins("http://localhost:3000") // A origem do seu frontend React
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // Métodos permitidos
            .allowedHeaders("*") // Todos os headers
            .allowCredentials(true); // Permite envio de credenciais (cookies, etc)
    }
}