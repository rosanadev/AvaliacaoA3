FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY schedule/pom.xml .
COPY schedule/src ./src
RUN mvn clean install -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
