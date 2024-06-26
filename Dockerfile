FROM openjdk:17-jdk-slim
EXPOSE 8080

#ARG JAR_FILE=target/*.jar
# 정확한 .jar 파일의 경로를 설정
ARG JAR_FILE=build/libs/DotheReco-0.0.1-SNAPSHOT.jar

# JAR 파일 메인 디렉토리에 복사
COPY ${JAR_FILE} app.jar

# 시스템 진입점 정의
ENTRYPOINT ["java","-jar","/app.jar"]