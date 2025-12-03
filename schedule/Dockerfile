FROM maven:3.9.6-eclipse-temurin-17
WORKDIR /app
COPY pom.xml .
COPY src ./src
EXPOSE 8080
RUN mvn clean install
