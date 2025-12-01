# Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia TUDO
COPY . .

# Debug: mostra o que foi copiado
RUN echo "=== Arquivos copiados ===" && ls -la

# Build do projeto
RUN mvn clean package -DskipTests

# Run
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta
EXPOSE 8080

# Comando de inicialização
ENTRYPOINT ["sh", "-c", "java -jar app.jar"]
