docker-compose.yml  react-frontend/  springboot-backend/

above is the git repository structure of my project

this is the docker compose file

```yml
services:
  react:
    build: 
      context: ./react-frontend
      dockerfile: Dockerfile.prod
    container_name: myapp-react-frontend
    # volumes:
    #   - ./react-frontend:/myfrontend_dir
    networks:
      - fe-be
    ports:
      - "80:80"
    restart: always
    tty: true
    depends_on:
      springboot: 
        condition: service_started
    mem_limit: 500M
  springboot:
    build:
      context: ./springboot-backend
      dockerfile: Dockerfile.prod
    container_name: myapp-springboot
    environment:
      - MY_POSTGRES_HOST=mypostgres
      - MY_POSTGRES_PORT=5432
      - MY_POSTGRES_DB=postgres
      - MY_POSTGRES_USER=postgres
      - MY_POSTGRES_PASSWORD=postgres
      - MY_REDIS_HOST=myredis
      - MY_REDIS_PORT=6379
      - MY_REDIS_PASSWORD=mysupersecureredispassword42
    # volumes:
    #   - ./springboot-backend:/mybackend_build_dir
    ports:
      - "8080:8080"
    networks:
      - fe-be
      - be-db
    restart: always
    depends_on:
      mypostgres:
        condition: service_healthy
      myredis:
        condition: service_healthy
    mem_limit: 1.5G
  mypostgres:
    image: postgres:16.2-alpine
    container_name: myapp-postgres
    restart: always
    ports:
      - "5555:5432"
    networks:
      - be-db
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: [ "CMD-SHELL", "pg_isready -U postgres" ]
      interval: 10s
      timeout: 30s
      retries: 3
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=postgres
    mem_limit: 500M
  myredis:
    image: redis:7.2.4-alpine
    container_name: myapp-redis
    command: redis-server --requirepass mysupersecureredispassword42
    networks:
      - be-db
    healthcheck:
      test: [ "CMD", "redis-cli", "ping" ]
      interval: 1s
      timeout: 3s
      retries: 30
    ports:
      - "6666:6379"
    volumes:
      - redis-data:/data
    restart: always
    mem_limit: 500M
networks:
  fe-be: {}
  be-db: {}
volumes:
  postgres-data: {}
  redis-data: {}
  mongo-data: {}
```

this is the Dockerfile.prod of react

```Dockerfile
# dependency_stage
FROM node:20-alpine as deps
WORKDIR /myreact_dir
COPY package.json .
RUN npm i

# build_stage
FROM deps as build
WORKDIR /myreact_dir
COPY . .
RUN npm run build

# run_stage
FROM nginx:1.25.4-alpine as run_stage
COPY --from=build /myreact_dir/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /myreact_dir/dist .
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
```

this is the Dockerfile.prod of springboot

```Dockerfile
# deps_stage
FROM maven:3.9.6-eclipse-temurin-17-alpine as deps_stage
WORKDIR /mybackend_build_dir
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x ./mvnw
RUN mvn dependency:go-offline

# This layer will be rebuilt when source code changes
FROM deps_stage as build_stage
COPY src src
RUN mvn clean install -DskipTests

# run_stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /mybackend_dir
COPY --from=build_stage "/mybackend_build_dir/target/*.jar" app.jar
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /mybackend_dir
USER appuser:appgroup
CMD [ "java", "-jar", "/mybackend_dir/app.jar" ]
```


because the client machine don't have docker so I planned to create a pom.xml file in root then when run mvn clean install in root it will

first npm run build the react-frontend then copy all content of output folder named: "dist" into folder src/main/resources/static/ 
then mvn clean install the springboot-backend into a .jar 

the purpose of this is I want to package all 2 react and spring boot into a single .jar for ease of deployment because my client machine not having docker