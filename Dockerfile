FROM eclipse-temurin:17

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew clean build -x test --no-daemon

EXPOSE 8080

CMD ["java", "-jar", "build/libs/heladeria-0.0.1-SNAPSHOT.jar"]