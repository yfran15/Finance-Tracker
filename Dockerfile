#FROM eclipse-temurin:17-jdk-alpine
#WORKDIR /app
#COPY target/demo3-0.0.1-SNAPSHOT.jar app.jar
#EXPOSE 8080
#ENTRYPOINT ["java", "-jar", "app.jar"]

# ---------- Stage 1: Build the JAR ----------
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Install Maven (since Alpine doesn't come with it)
RUN apk add --no-cache maven

# Copy all source files
COPY . .

# Build the JAR (skip tests to speed up)
RUN mvn clean package -DskipTests

# ---------- Stage 2: Run the JAR ----------
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/demo3-0.0.1-SNAPSHOT.jar app.jar

# Expose app port
EXPOSE 8080

# Start the app
ENTRYPOINT ["java", "-jar", "app.jar"]
