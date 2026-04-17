# Furniture Backend Microservices

A robust furniture management backend built with a microservices architecture using **Node.js**, **Express**, **MongoDB**, and **Redis**.

## 🚀 Architecture Overview

The system is split into two independent services to ensure scalability and separation of concerns:

1.  **Auth Service (Port 5001)**: Manages user identity, registration, and session-based authentication using JWT and Redis.
2.  **Product Service (Port 5002)**: Manages the furniture catalog with full CRUD capabilities, secured by cross-service JWT verification.

---

## 🛠 Tech Stack

-   **Runtime**: Node.js (ES Modules)
-   **Framework**: Express.js
-   **Databases**: 
    -   **MongoDB**: Primary data store for Users and Products.
    -   **Redis**: High-speed session storage and token management.
-   **Containerization**: Docker & Docker Compose
-   **Security**: JWT (Stateless Auth) & Bcrypt (Password Hashing)

---

## 🏃 Quick Start

### 1. Prerequisites
- Docker & Docker Compose
- Node.js (v18+)

### 2. Start Databases
```bash
docker-compose up -d
```
*MongoDB: localhost:27018 | Redis: localhost:6380*

### 3. Run Services
Run the following script to install all dependencies and start the microservices in PM2:
```bash
chmod +x start.sh
./start.sh
```
*Wait for the script to finish. It will show the PM2 status table once complete.*

---

## 📚 API Documentation

### <a id="auth-register"></a>1. User Registration
**URL:** \`http://localhost:5001/api/auth/register\`  
**Method:** \`POST\`  
**Content-Type:** \`application/json\`

Creates a new user account with a hashed password.

\`\`\`mermaid
sequenceDiagram
    participant User
    participant AuthAPI
    participant MongoDB
    
    User->>AuthAPI: POST /api/auth/register (email, password, name)
    AuthAPI->>MongoDB: Check if user exists
    AuthAPI->>AuthAPI: Hash password
    AuthAPI->>MongoDB: Save new User
    MongoDB-->>AuthAPI: Success
    AuthAPI-->>User: 201 Created ("User registered successfully")
\`\`\`

#### Request Body:
\`\`\`json
{
  "email": "jane@example.com",
  "password": "securepassword123",
  "name": "Jane Doe"
}
\`\`\`

---

### <a id="auth-login"></a>2. User Login
**URL:** \`http://localhost:5001/api/auth/login\`  
**Method:** \`POST\`

Authenticates the user and returns a Bearer token.

\`\`\`mermaid
sequenceDiagram
    participant User
    participant AuthAPI
    participant MongoDB
    participant Redis
    
    User->>AuthAPI: POST /api/auth/login (email, password)
    AuthAPI->>MongoDB: Find User by email
    AuthAPI->>AuthAPI: Compare passwords
    AuthAPI->>AuthAPI: Generate JWT
    AuthAPI->>Redis: Store session (token)
    AuthAPI-->>User: 200 OK (token + user details)
\`\`\`

#### Successful Response:
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1Ni...",
  "user": {
    "id": "678e...",
    "email": "jane@example.com",
    "name": "Jane Doe"
  }
}
\`\`\`

---

### <a id="product-list"></a>3. List Products
**URL:** \`http://localhost:5002/api/products\`  
**Method:** \`GET\`

Retrieves all furniture items in the catalog. (Public access)

#### Successful Response:
\`\`\`json
[
  {
    "_id": "69e1...",
    "name": "Eames Lounge Chair",
    "price": 1200,
    "stock": 5,
    "category": "Chairs"
  }
]
\`\`\`

---

### <a id="product-add"></a>4. Add Product
**URL:** \`http://localhost:5002/api/products\`  
**Method:** \`POST\`  
**Authorization:** \`Bearer <token>\`

Adds a new furniture item. **Requires authentication.**

\`\`\`mermaid
sequenceDiagram
    participant Admin
    participant ProductAPI
    participant MongoDB
    
    Admin->>ProductAPI: POST /api/products (+ Bearer Token)
    ProductAPI->>ProductAPI: Verify JWT Secret
    ProductAPI->>MongoDB: Save Product
    MongoDB-->>ProductAPI: Success
    ProductAPI-->>Admin: 201 Created (Product Object)
\`\`\`

#### Request Body:
\`\`\`json
{
  "name": "Minimalist Oak Table",
  "description": "Solid oak dining table for 6 people",
  "price": 850,
  "category": "Tables",
  "stock": 2
}
\`\`\`

---

### <a id="product-edit"></a>5. Edit Product
**URL:** \`http://localhost:5002/api/products/:id\`  
**Method:** \`PUT\`  
**Authorization:** \`Bearer <token>\`

Updates an existing product. **Requires authentication.**

---

### <a id="product-delete"></a>6. Delete Product
**URL:** \`http://localhost:5002/api/products/:id\`  
**Method:** \`DELETE\`  
**Authorization:** \`Bearer <token>\`

Removes a product from the database. **Requires authentication.**

---

## ⚠️ Error Handling

The API uses standard HTTP status codes:

-   **400 Bad Request**: Missing required fields or validation failure.
-   **401 Unauthorized**: Missing, expired, or invalid JWT.
-   **404 Not Found**: Product not found.
-   **500 Internal Server Error**: Unexpected server-side issues.

\`\`\`json
{
  "error": "Reason for failure"
}
\`\`\`
