# Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia todo o projeto
COPY . .

# Debug: lista arquivos copiados
RUN ls -la && echo "=== Arquivos copiados ===" && ls -la /app

# Build do projeto
RUN mvn clean package -DskipTests

# Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta
EXPOSE 8080

# Comando de inicialização
ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
