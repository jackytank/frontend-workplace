[Project Context: EcoStore Microservices]

Hello! The following README.md is a project requirement and phased implementation plan you previously generated for me.

Its purpose is to guide my learning of microservices concepts by building an e-commerce application named EcoStore, phase by phase.

I am the developer following this plan. Please act as my technical mentor for this project. Re-familiarize yourself with the full context below. I will then ask a question about the specific phase I am working on.

---

# EcoStore: A Microservices Learning Project

## 1.0 Project Vision & Context

### 1.1 Project Name
**EcoStore**

### 1.2 Project Statement
EcoStore is a modern, cloud-native e-commerce platform built on a microservices architecture. It serves as a comprehensive learning project to master core and advanced concepts of distributed systems. The primary goal is not to build a production-ready behemoth, but to implement and understand the patterns and technologies that power such systems.

### 1.3 Learning Objectives
This project is designed to facilitate hands-on learning of the following concepts:
*   **Contract-First Development:** Using **OpenAPI** to define and generate API contracts.
*   **Core Microservices:** Decomposing a monolith into single-responsibility services.
*   **Build Tools:** Migrating from Maven to **Gradle**.
*   **Containerization:** Using **Docker** and Docker Compose for development and deployment.
*   **Polyglot Persistence:** Using the right database for the job, with a **deep dive into MongoDB**'s features (**PostgreSQL** is also used).
*   **API Gateway:** A single entry point for all client requests (**Spring Cloud Gateway**).
*   **Service Discovery:** Enabling services to find each other dynamically (**Netflix Eureka**).
*   **Centralized Configuration:** Managing configuration for all services in one place (**Spring Cloud Config**).
*   **Security:** Securing the system using **Spring Security** and **OAuth2/OIDC** (e.g., Keycloak).
*   **Resiliency:** Preventing cascading failures with patterns like **Circuit Breakers** (**Resilience4j**).
*   **Asynchronous Communication:** Using an event-streaming platform (**Apache Kafka**) for event-driven interactions.
*   **Observability:** Centralized Logging (**Loki**), Distributed Tracing (**Zipkin**), and Monitoring/Metrics (**Prometheus & Grafana**).

---

## 2.0 High-Level System Architecture

The system is designed around a set of independent services that communicate through well-defined synchronous APIs and asynchronous events. All external client requests are routed through a central **API Gateway**.

The typical flow is:
1.  A client sends an HTTP request to the **API Gateway**.
2.  The Gateway authenticates the request, then routes it to the appropriate downstream service.
3.  Services find each other using the **Service Discovery** server.
4.  For complex operations like creating an order, the `order-service` will orchestrate synchronous calls to other services.
5.  Upon a state change (e.g., an order is placed), a service will produce an event to an **Apache Kafka** topic.
6.  Other services (like `notification-service` and `inventory-service`) will consume these events as part of a consumer group and react accordingly, decoupling the system.
7.  Each service has its own dedicated database, chosen based on its specific data needs.

---

## 3.0 Core Microservices Breakdown

Here are the definitions, responsibilities, and detailed API contracts for each core business service.

### 3.1 User Service (`user-service`)
*   **Responsibility:** Manages user data, registration, and profile information.
*   **Database Technology:** **PostgreSQL**
*   **Database Schema (`users` table):**
    ```sql
    CREATE TABLE users (
        id UUID PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        shipping_address TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    ```
*   **API Contract:**

| Function | API Endpoint | Request Body (DTO) | Success Response (2xx) | Error Responses (4xx/5xx) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Register User** | `POST /api/v1/users` | `{ "firstName": "...", "lastName": "...", "email": "...", "password": "..." }` | **201 Created**: `{ "id": "uuid", "email": "..." }` | `400 Bad Request`, `409 Conflict` | Produces a `UserRegisteredEvent` to a Kafka topic. |
| **Get My Profile** | `GET /api/v1/users/me` | (None) | **200 OK**: `{ "id": "...", "firstName": "...", "lastName": "...", "email": "...", "shippingAddress": "..." }` | `401 Unauthorized`, `404 Not Found` | **Protected endpoint**. |
| **Update Profile** | `PUT /api/v1/users/me` | `{ "firstName": "...", "lastName": "...", "shippingAddress": "..." }` | **200 OK**: The full, updated user object. | `401 Unauthorized`, `404 Not Found` | **Protected endpoint**. |
| **Get User by ID** | `GET /api/v1/users/{userId}` | (None) | **200 OK**: `{ "id": "...", "email": "...", "firstName": "..." }` | `404 Not Found` | **Internal endpoint**. |

### 3.2 Product Service (`product-service`)
*   **Responsibility:** Manages the product catalog. This service is designed to be a comprehensive learning module for various MongoDB features.
*   **Database Technology:** **MongoDB**
*   **Database Schema (`products` collection):** The schema is enhanced to support advanced queries.
    ```json
    {
      "_id": "ObjectId('...')",
      "sku": "UNIQUE_SKU_123",
      "name": "Organic Cotton T-Shirt",
      "description": "A soft, eco-friendly t-shirt made from 100% organic cotton.",
      "price": { "amount": "25.99", "currency": "USD" },
      "attributes": [
        { "name": "Color", "value": "Blue" },
        { "name": "Size", "value": "M" }
      ],
      "category": "Apparel",
      "tags": ["eco-friendly", "organic", "summer-collection"], // Array for $in queries
      "stockInfo": { // Nested document for dot notation queries
          "quantity": 150, // This is denormalized data for quick lookups
          "warehouseLocation": "A-12"
      },
      "reviews": [ // Embedded array of documents for review management
          {
              "reviewId": "ObjectId('...')",
              "userId": "UUID-from-user-service",
              "rating": 5,
              "comment": "Incredibly soft!"
          }
      ],
      "viewCount": 2500, // Number for $inc operator
      "createdAt": "ISODate('...')"
    }
    ```
*   **API Contract (Expanded for MongoDB Learning):**

| Function | API Endpoint | Request/Query Params | Success Response (2xx) | Notes on Required MongoDB Feature |
| :--- | :--- | :--- | :--- | :--- |
| **Add Product** | `POST /api/v1/products` | Request Body (Product DTO) | **201 Created**: The full product object. | Basic `insert()` operation. |
| **Get Product by ID** | `GET /api/v1/products/{id}` | (None) | **200 OK**: The full product object. | Basic `findById()`. **Also implement `$inc` to increment `viewCount` on every successful read.** |
| **Complex Search** | `GET /api/v1/products` | **Query Params:**<br>`category=Apparel`<br>`minPrice=20`<br>`maxPrice=50`<br>`tags=eco-friendly,summer` | **200 OK**: Paginated list of products. | **Must use a combination of query operators:** `$eq` for category, `$gte`/`$lte` for price range, and `$in` for tags. |
| **Full-Text Search** | `GET /api/v1/products/search` | **Query Param:**<br>`q=soft cotton` | **200 OK**: List of relevant products sorted by relevance. | **Requires creating a Text Index** on `name` and `description` fields and using the `$text` and `$search` operators. |
| **Category Stats** | `GET /api/v1/products/stats/category` | (None) | **200 OK**: `[ { "category": "Apparel", "count": 15, "avgPrice": 35.50 }, ... ]` | **Must use the Aggregation Framework:** A pipeline with `$group`, `$count`, and `$avg`. |
| **Update Price** | `PUT /api/v1/products/{id}/price` | `{ "amount": "29.99", "currency": "USD" }` | **200 OK**: The updated product. | Use dot notation with the `$set` operator to update a nested document (`price.amount`). |
| **Add a Review** | `POST /api/v1/products/{id}/reviews` | `{ "userId": "...", "rating": 5, "comment": "..." }` | **201 Created**: The product with the new review. | Use the `$push` operator to add a new review object to the `reviews` array. |
| **Remove a Review** | `DELETE /api/v1/products/{id}/reviews/{reviewId}`| (None) | **204 No Content** | Use the `$pull` operator to remove a specific review from the `reviews` array based on `reviewId`. |

*   **MongoDB Learning Focus Checklist:**
    When implementing the `product-service`, ensure you actively use and understand the following:
    *   **Query & Projection Operators:** `$eq`, `$gt`, `$gte`, `$lt`, `$lte`, `$and`, `$or`, `$exists`, `$in`, `$all`.
    *   **Full-Text Search:** Creating a **Text Index** and using `$text` with `$search`.
    *   **Aggregation Pipeline:** `$match`, `$group`, `$sort`, and accumulators like `$sum`, `$avg`, `$count`.
    *   **Update Operators:** `$set` (with dot notation), `$inc`, `$push`, `$pull`.
    *   **Indexing:** Single-field, compound, and text indexes.

### 3.3 Inventory Service (`inventory-service`)
*   **Responsibility:** Manages stock levels. Demands high consistency.
*   **Database Technology:** **PostgreSQL**
*   **Database Schema (`inventory` table):**
    ```sql
    CREATE TABLE inventory (
        id SERIAL PRIMARY KEY,
        product_sku VARCHAR(100) UNIQUE NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity >= 0),
        last_updated TIMESTAMPTZ DEFAULT NOW()
    );
    ```
*   **API Contract & Event Handlers:**

| Function | API Endpoint | Request Body (DTO) | Success Response (2xx) | Error Responses (4xx/5xx) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Get Stock Level** | `GET /api/v1/inventory/{productSku}` | (None) | **200 OK**: `{ "productSku": "...", "quantity": 150 }` | `404 Not Found` | |
| **Check Stock** | `POST /api/v1/inventory/check-stock` | `{ "items": [ {"sku": "...", "quantity": 1} ] }` | **200 OK**: `{ "sufficient": true, "items": [ ... ] }` | `400 Bad Request` | **Internal endpoint**. |

*   **Event Handlers (Asynchronous Operations):**
    *   **Consumes `OrderPlacedEvent`:** Consumes events from a Kafka topic to decrement stock quantity. Must be idempotent.

### 3.4 Order Service (`order-service`)
*   **Responsibility:** Manages the order lifecycle. Acts as an orchestrator.
*   **Database Technology:** **PostgreSQL**
*   **Database Schema (`orders`, `order_items` tables):** (Defined as before)
*   **API Contract:**

| Function | API Endpoint | Request Body (DTO) | Success Response (2xx) | Error Responses (4xx/5xx) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Create Order** | `POST /api/v1/orders` | `{ "items": [ ... ], "shippingAddress": "..." }` | **201 Created**: The new order object. | `400 Bad Request`, `401 Unauthorized` | **Protected**. **Circuit Breaker**. Produces `OrderPlacedEvent`. |
| **Get Order by ID** | `GET /api/v1/orders/{orderId}` | (None) | **200 OK**: The full order object. | `401 Unauthorized`, `403`, `404` | **Protected**. |
| **List My Orders** | `GET /api/v1/orders` | (None) | **200 OK**: A paginated list of orders. | `401 Unauthorized` | **Protected**. |

### 3.5 Notification Service (`notification-service`)
*   **Responsibility:** Sends asynchronous notifications.
*   **API Contract:** This service **does not expose any public HTTP APIs**. It operates by consuming events from Kafka topics.
*   **Event Handlers:**
    *   **Consumes `UserRegisteredEvent`:** Sends a "Welcome to EcoStore!" email.
    *   **Consumes `OrderPlacedEvent`:** Fetches user details from `user-service` and sends an "Order Confirmation" email.

---

## 4.0 Infrastructure & Cross-Cutting Concerns

| Component | Recommended Technology | Role in EcoStore |
| :--- | :--- | :--- |
| **Build Tool** | **Gradle** | Used to build all service artifacts in a multi-project build. |
| **Containerization** | **Docker & Docker Compose** | Each service has a `Dockerfile`. A `docker-compose.yml` orchestrates all services locally. |
| **API Gateway** | **Spring Cloud Gateway** | Single entry point. Handles routing, security (JWT validation), and rate limiting. |
| **Service Discovery** | **Netflix Eureka** | Allows services to register and discover each other dynamically. |
| **Config Server** | **Spring Cloud Config** | Centralizes all `application.yml` files in a Git repository. |
| **Security** | **Spring Security + OAuth2/OIDC** | Use an Auth Server (e.g., Keycloak) to issue JWTs. |
| **Resiliency** | **Resilience4j** | Implement Circuit Breakers in `order-service` to prevent cascading failures. |
| **Event Streaming** | **Apache Kafka** | Decouples services via a durable, scalable event log. Services produce to and consume from topics. |
| **Logging & Tracing** | **Loki & Zipkin** | Centralized logging and distributed tracing for observability. |
| **Monitoring & Metrics** | **Prometheus & Grafana** | Scrape metrics from services and build monitoring dashboards. |

---

## 5.0 Phased Implementation Roadmap

Follow this roadmap to build the project incrementally, mastering one concept at a time.

### Phase 0: Project Setup & Contract-First Design
This foundational phase ensures our project is built on solid, modern principles from the start.

1.  **Set up Multi-Project Gradle Build:** Create the root project and the sub-project directories for the initial services (`user-service`, `product-service`).
2.  **Define OpenAPI Specifications:** For each service, create a formal API contract as a YAML file (e.g., `product-api.yml`). Use the API Contract tables in this README as the blueprint to define all paths, operations, DTOs (`schemas`), and responses.
3.  **Configure Code Generation:** Add the `openapi-generator-gradle-plugin` to each service's `build.gradle` file. Configure it to read your YAML contract and generate the Spring server interfaces and model classes (DTOs).

### Phase 1: The Core Services Implementation
With the contracts and generated code in place, we now implement the business logic.

1.  **`user-service`:** Implement its controller and business logic, and set up its **PostgreSQL** database.
2.  **`product-service` (MongoDB Deep Dive):**
    *   Implement the *full API contract* defined above.
    *   Focus on correctly using the required MongoDB query operators, aggregation pipelines, update operators, and indexing strategies to satisfy each endpoint's requirements. This is a primary learning objective.
3.  Create `Dockerfile` for each service and a `docker-compose.yml` to run them and their databases.

### Phase 2: The E-Commerce Flow
1.  Define the OpenAPI contracts for `inventory-service` and `order-service`. Configure their build files for code generation.
2.  Implement the controllers and business logic for these new services.
3.  Implement the "Create Order" logic, involving direct REST calls (using hardcoded URLs for now) to the `product` and `inventory` services.

### Phase 3: Building the Microservice Backbone

> **Important Note:** The Service Discovery server (Eureka) is a foundational infrastructure component. Therefore, you will create a **brand new, standalone Spring Boot project** for it (e.g., `discovery-server`). It will have the `@EnableEurekaServer` annotation and be configured *not* to register with itself.

1.  Create and run the standalone **Service Discovery** server (Eureka).
2.  Introduce **Spring Cloud Gateway**. Configure routes for your existing services.
3.  Modify all other services to be Eureka *clients* that register with the discovery server. Update their communication logic to use a discovery-aware client.

### Phase 4: Hardening and Centralizing
1.  Set up **Spring Cloud Config Server**. Migrate all configurations to a central Git repository.
2.  Implement **Security**. Set up a standalone OAuth2 provider (Keycloak is a great choice) and secure endpoints on the Gateway and services.

### Phase 5: Resiliency and Observability
1.  Implement a **Circuit Breaker** (Resilience4j) with a fallback in `order-service`.
2.  Set up **Prometheus** and **Grafana** to monitor service metrics via Actuator endpoints.
3.  Integrate **Zipkin** for distributed tracing across services.

### Phase 6: Asynchronous Communication with Kafka
1.  Add **Apache Kafka** and Zookeeper containers to your Docker Compose setup.
2.  Develop the `notification-service`.
3.  Refactor `order-service` to *produce* an `OrderPlacedEvent` to a Kafka topic upon successful order creation.
4.  Refactor `inventory-service` to *consume* this event from the topic to decrement stock.
5.  Implement the consumer in `notification-service` to send emails based on `OrderPlacedEvent` and `UserRegisteredEvent`.