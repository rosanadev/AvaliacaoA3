FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY schedule/pom.xml .
COPY schedule/src ./src

RUN mvn -q -e -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
