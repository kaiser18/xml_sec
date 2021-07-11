
###### Stage 1 ########
FROM maven:3.5-jdk-8 AS build
#FROM maven:3.6.3-jdk-16-slim AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
#RUN mvn -f /usr/src/app/pom.xml clean package
COPY ./target/bezbednost-0.0.1-SNAPSHOT.jar /usr/src/app/target/bezbednost-0.0.1-SNAPSHOT.jar

###### Stage 2 ########
FROM gcr.io/distroless/java
COPY --from=build /usr/src/app/target/bezbednost-0.0.1-SNAPSHOT.jar /usr/app/bezbednost-0.0.1-SNAPSHOT.jar
EXPOSE 8443
ENTRYPOINT ["java","-jar","/usr/app/bezbednost-0.0.1-SNAPSHOT.jar"]
