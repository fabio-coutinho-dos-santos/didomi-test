# API-RESTful

RESTful API developed for user registration and consent events as a technical test for a senior backend engineer position at DIDOMI.

## Main elements used in the development

- node v20.9.0
- nestJs
- express
- typescript
- postgres
- typeORM
- jest
- supertest
- eslint
- swagger
- docker
- docker compose
- kubernetes

## Main design patterns adopted

- Clean Code
- Single Responsibility Principle (SRP)
- Don't repeat yourself (DRY)
- Keep it simple, stupid (KISS)
- You aren't gonna need it (YAGNI)
- Repository
- Dependency Injection
- Dependency Inversion
- Interface Segregation

## Code Architecture and Design

The API structure and folder hierarchy were defined by applying Domain-Driven Design (DDD) modeling practices along with Clean Architecture. This architecture protects business rules, with entities related to the core domain of the application at the center, keeping business-related parts on the periphery, as Clean and Hexagonal architectures suggest.

As part of DDD practices, domain entities were created with their respective validations from business rules, along with a folder hierarchy that maintains a ubiquitous language.

From a Clean Architecture perspective, anti-corruption layers were created between domain elements and application components, enabling both dependency injection and inversion, resulting in more decoupled code.

Event-driven architecture was also applied in one of the implemented features.

## Description

The API has two domain entities, Users and Events. Following the development scope convention, a User can have multiple Events, but an Event can belong to only one User.

Additionally, there is an `events_history` table that logs all events registered for a user. The `events` table only stores the latest events for a user, maintaining only the current status of events for that user.

To perform CRUD operations on these entities and their business rules, they were modeled for the PostgreSQL database as follows:

- Tables:

  ![Alt text](docs/database/image.png)

To update the status in the `events` table, an event-driven architecture approach was used. When an event arrives via the controller, it is recorded in `events_history` within the use case, and then a domain event is triggered. This domain event is captured to update the user's consent status in the `events` table.

The API's maturity level follows Level 2, making it RESTful by combining HTTP verbs with their semantic meanings and expressively using resources to execute actions on application routes.

All development was guided by tests, including unit tests for critical application points like domain entity validations and use cases, as well as integration tests for all application routes, using a separate database for testing.

- Application Test Coverage

![Alt text](docs/test-coverage.png)

## Implementation Details

- High test coverage. To check, run **npm run test:cov** after configuring the project locally.
- Git flow and conventional commits were used.
- Clean and event-driven architecture applied.
- Structured JSON logs for observability tool scraping.

### Due to the scope of this being a test application, the following were not included:

- Instrumentation for metrics, traces, and logs for observability.
- Full CI-CD pipeline for production deployment.
- User email verification.

## CI-CD

- As a DevOps practice covering continuous build and delivery, a CI pipeline using GitHub Actions was created for this test scope. It builds the project, runs a linter for static code error checks, and executes unit tests.

- For continuous delivery, the application is deployed on Google Cloud Platform's Cloud Run, linked to the project repository. When there’s an update in the main branch, a new version is built from the Docker image described in the Dockerfile and deployed to production.

- To protect deployment, configure the GitHub repository to prevent direct pushes to the main branch, allowing only PR approvals after pipeline completion. These configurations were not applied due to time constraints and the test scope.

- Another strategy, which was not adopted due to costs and scope, is integrating the CI pipeline with SonarQube for rules to block poorly written code and low test coverage.

- Running the application requires two databases, one for application data and another for integration testing. Locally, the docker compose file creates both databases, while only the application database was created in a provider (Render) for production.

- Deployment.yaml, secrets.yaml, and service.yaml files were created for deploying the application on a Kubernetes cluster with properly configured environment variables.

- **Note**: GCP hosting and Render for the database were chosen for free resources with limitations, enough to test the application in a serverless production environment. Other strategies could be used, such as building CI pipelines in cloud providers (AWS CodePipeline or GCP Cloud Build) with Docker image storage (Artifact Registry or ECR) and subsequent serverless deployment. These strategies were not adopted due to cost constraints.

## OpenAPI Documentation and Production Application

- Production URL on GCP Cloud Run service = https://didomi-app-test-370724019807.us-central1.run.app

- OpenAPI documentation is in `docs/api.yaml` describing all application routes.

- To view this documentation and execute requests, Swagger can be configured for both local and production environments.

- Swagger documentation available at: [https://didomi-app-test-370724019807.us-central1.run.app/api/v1/doc/](https://didomi-app-test-370724019807.us-central1.run.app/api/v1/doc/)

## Applied Architecture

- For this technical test with limited time and cost, the simplest architecture fulfilling the requirements was used, as shown below:

![Alt text](docs/architecture/v1.png)

## Architectural Improvements

- If this application needed to scale, architectural improvements could include:

- Adopting a microservices architecture with event streaming, creating one microservice for user and consent management and another for auditing, maintaining only the current state of consents in the database and processing requests for reports and other demands in the audit service. These two microservices would communicate via messaging (SQS, Kafka, RabbitMQ, PubSub, etc.).

- Automated deployment:
   - CI Pipeline: Run lint, unit, and integration tests, build the Docker image, and store it in a registry like AWS ECR or GCP Artifact Registry.
   - CD Pipeline: Trigger a deployment pipeline upon image storage, deploying on k8s, CloudRun, ECS, Fargate, etc.
   - Next, set up Load Balancer/API gateway and Auto Scale Group to scale the application based on request load. Alternatively, a Kubernetes cluster with HPA could be configured for horizontal pod scaling.

- Authentication and authorization strategies could include managed solutions like AWS Cognito or Keycloak as identity servers.

![Alt text](docs/architecture/v2.png)

## Local Execution

### Using Docker Compose

- To run the code locally with Docker Compose, clone the repository and follow these steps:

  - Create a `.env` file in the project root.
  - Configure the following environment variables in this `.env` file:
    - DB_URL_CONNECTION=postgres://user:password@svc-db:5432/postgres
    - DB_TEST_URL_CONNECTION=postgres://user:password@svc-db-test:5432/postgres
    - API_VERSION=v1
    - PORT=3000
  - Variables are detailed in `env-example.txt`.
  - Create an internal Docker network to connect containers: **docker network create didomi-net**
  - From the project root, run **docker-compose up**

- These steps will create database and application containers, and the application will start automatically.

### Using Installed Node

To run the code locally, clone the repository and follow these steps:

- Create a `.env` file in the project root.
- Configure the following environment variables in this `.env` file:
  - POSTGRES_URL_CONNECTION=production-database-url
  - POSTGRES_TEST_URL_CONNECTION=production-database-test-url
  - API_VERSION=v1
  - PORT=3000
- Run commands from the project root:
  - **npm install**
  - **npm run start:dev**

**_Note_**: If Postgres is also installed locally, create two separate databases and set environment variables as:

- postgres://user:password@host:port/dbName

## Kubernetes Deployment

- A deployment, service, and secrets file were created to deploy the application in a Kubernetes cluster.
- Steps: with `kubectl` and `minikube` installed locally:
  - Build Docker image: **docker build -t didomi-app-image .**
  - Copy image to Minikube’s internal registry: **minikube image load didomi-app-image:latest**
  - Update `secrets.yaml` with production DB connection strings in base64
  - Run **kubectl apply -f cd/k8s/secrets.yaml**
  - Run **kubectl apply -f cd/k8s/service.yaml**
  - Run **kubectl apply -f cd/k8s/deployment.yaml**
  - Then, forward the container port in Kubernetes to make requests to it via your local network with:
    - **kubectl port-forward <service-name> <localPort>:<servicePort>**
    - Example: **kubectl port-forward didomi-service 3000:3000**
  - Send requests to http://localhost:3000/ to access the pod in k8s.
