# Build
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copia o POM
COPY pom.xml .

# Baixa as dependências (cria layer de cache)
RUN mvn dependency:go-offline -B || true

# Copia o código fonte
COPY src ./src

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
ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
