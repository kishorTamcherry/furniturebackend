# Furniture Backend Microservices

A robust furniture management backend built with a microservices architecture using Node.js, Express, MongoDB, and Redis.

## Architecture Overview

The system is split into two independent services to ensure scalability and separation of concerns:

1.  **Auth Service (Port 5001)**: Manages user identity, registration, and session-based authentication using JWT and Redis.
2.  **Product Service (Port 5002)**: Manages the furniture catalog with full CRUD capabilities and image upload support, secured by cross-service JWT verification.

## Tech Stack

-   **Runtime**: Node.js (ES Modules)
-   **Framework**: Express.js
-   **Databases**: 
    -   **MongoDB**: Primary data store for user and product data.
    -   **Redis**: Session storage and token management.
-   **Containerization**: Docker & Docker Compose
-   **Security**: JSON Web Tokens (JWT) & Bcrypt (Password Hashing)
-   **File Handling**: Multer (Multipart Form-Data)

## Setup and Deployment

### 1. Prerequisites
- Docker and Docker Compose
- Node.js (v18+)
- PM2 (Process Manager 2)

### 2. Infrastructure Startup
Start the database containers using Docker Compose. This initializes MongoDB and Redis.
```bash
docker-compose up -d
```
*   MongoDB: localhost:27018
*   Redis: localhost:6380

### 3. Service Initialization
Run the startup script to install dependencies and launch the microservices via PM2:
```bash
chmod +x start.sh
./start.sh
```

### 4. Docker Hub Images
Pre-built Docker images are available for both services:
- **Auth Service**: `kishorth/furniture-auth:latest`
- **Product Service**: `kishorth/furniture-product:latest`

## API Documentation

### Authentication Service (Port 5001)

#### User Registration
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**: `JSON`
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Full Name"
  }
  ```

#### User Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**: `JSON`
- **Success Response**: Returns a Bearer token and user details.

---

### Product Service (Port 5002)

#### List Products
- **URL**: `/api/products`
- **Method**: `GET`
- **Access**: Public

#### Add Product
- **URL**: `/api/products`
- **Method**: `POST`
- **Auth**: `Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `name`: String (Required)
  - `price`: Number (Required)
  - `description`: String
  - `category`: String
  - `image`: File (Optional - JPEG, PNG, WEBP)

#### Edit Product
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Auth**: `Bearer <token>`
- **Content-Type**: `multipart/form-data`

#### Delete Product
- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Auth**: `Bearer <token>`

---

## Static Assets
The Product Service serves uploaded images statically. Once an image is uploaded, it is accessible via the generated URL:
`http://localhost:5002/uploads/product-images/<filename>`

## Error Handling

The API uses standard HTTP status codes:

-   **400 Bad Request**: Validation failure or missing required fields.
-   **401 Unauthorized**: Missing, expired, or invalid JWT.
-   **404 Not Found**: Resource not found.
-   **500 Internal Server Error**: Unexpected server-side issues.

Response format:
```json
{
  "error": "Short description of the error",
  "details": [] 
}
```
