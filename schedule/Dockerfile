FROM maven:3.9.6-eclipse-temurin-17
WORKDIR /app

# Caminho correto usando subpasta schedule
COPY schedule/pom.xml .
COPY schedule/src ./src

RUN mvn -q -e -DskipTests package

FROM amazoncorretto:17
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
