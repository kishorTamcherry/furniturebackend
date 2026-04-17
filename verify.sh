#!/bin/bash
AUTH_URL="http://localhost:5001/api/auth"
PRODUCT_URL="http://localhost:5002/api/products"

echo "1. Registering user..."
curl -s -X POST $AUTH_URL/register   -H "Content-Type: application/json"   -d '{"email": "test@example.com", "password": "password123", "name": "Jane Doe"}' | jq

echo -e "\n2. Logging in..."
LOGIN_RES=$(curl -s -X POST $AUTH_URL/login   -H "Content-Type: application/json"   -d '{"email": "test@example.com", "password": "password123"}')
TOKEN=$(echo $LOGIN_RES | jq -r '.token')
echo "Token: $TOKEN"

echo -e "\n3. Adding product..."
ADD_RES=$(curl -s -X POST $PRODUCT_URL   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{"name": "Eames Lounge Chair", "price": 1200, "category": "Chairs", "stock": 5, "description": "Classic mid-century modern design"}')
PRODUCT_ID=$(echo $ADD_RES | jq -r '._id')
echo "Product ID: $PRODUCT_ID"

echo -e "\n4. Listing products..."
curl -s -X GET $PRODUCT_URL | jq

echo -e "\n5. Editing product..."
curl -s -X PUT $PRODUCT_URL/$PRODUCT_ID   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{"price": 1100, "stock": 10}' | jq

echo -e "\n6. Deleting product..."
curl -s -X DELETE $PRODUCT_URL/$PRODUCT_ID   -H "Authorization: Bearer $TOKEN" | jq

echo -e "\n7. Listing products after deletion..."
curl -s -X GET $PRODUCT_URL | jq
