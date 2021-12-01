# Dockerfile for creation of images on the x64 platform (windows 10 etc)
# The images are not compatible with raspberry pi and ARM architecture! For that use the Dockerfile-arm one
FROM maven:3.8.4-jdk-11-slim AS MAVEN_BUILD

COPY ./apps/api ./
ARG TREECREATE_JDBC_URL=url
ENV TREECREATE_JDBC_URL=${TREECREATE_JDBC_URL}
ARG TREECREATE_QUICKPAY_SECRET=secret
ENV TREECREATE_QUICKPAY_SECRET=${TREECREATE_QUICKPAY_SECRET}
ARG TREECREATE_MAIL_PASS=password
ENV TREECREATE_MAIL_PASS=${TREECREATE_MAIL_PASS}

# --quiet means only print out errors, -skipTests because they are all passing if merged
RUN mvn clean package --quiet -DskipTests

FROM openjdk:11-jre-slim

COPY --from=MAVEN_BUILD docker/api*.jar /treecreate-api.jar

CMD ["java", "-jar", "/treecreate-api.jar"]
