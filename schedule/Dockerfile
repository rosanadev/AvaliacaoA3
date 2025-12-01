# Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copia todos os arquivos do projeto
COPY . .

# Build do projeto
RUN mvn clean package -DskipTests

# Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/target/*.jar app.jar

# Expõe a porta (Railway usa a variável PORT)
EXPOSE 8080

# Usa a variável PORT do Railway
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
```

## 2. Verifique/Crie o arquivo `.dockerignore`

Crie um arquivo `.dockerignore` na raiz do projeto:
```
target/
.git/
.gitignore
*.md
.env
*.log
.DS_Store
