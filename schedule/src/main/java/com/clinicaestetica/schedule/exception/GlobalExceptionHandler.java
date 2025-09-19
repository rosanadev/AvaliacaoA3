package com.clinicaestetica.schedule.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException; // Para Optional.orElseThrow()

@ControllerAdvice
public class GlobalExceptionHandler {

    // Handler para exceções de validação (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // Handler para recursos não encontrados (ex: get por ID que não existe)
    @ExceptionHandler(NoSuchElementException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<String> handleNoSuchElementException(NoSuchElementException ex) {
        return new ResponseEntity<>("Recurso não encontrado: " + ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    // Handler genérico para outras exceções não tratadas especificamente
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleAllUncaughtException(
            Exception exception,
            WebRequest request) {
        // Logar a exceção para depuração (em um projeto real, use um logger)
        System.err.println("Ocorreu um erro interno do servidor: " + exception.getMessage());
        exception.printStackTrace(); // Apenas para depuração em desenvolvimento

        return new ResponseEntity<>("Ocorreu um erro interno do servidor. Por favor, tente novamente mais tarde.",
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
