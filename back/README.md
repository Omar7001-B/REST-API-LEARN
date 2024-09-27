# API Documentation

## 1. Get All Subscribers
**Request**  
GET `http://localhost:3000/subscribers`  
Accept: `application/json`

**Response**  
Status: 200 OK  
Content-Type: `application/json`

**Description**  
Fetches a list of all subscribers.

---

## 2. Get a Specific Subscriber by Username
**Request**  
GET `http://localhost:3000/subscribers/{username}`  
Accept: `application/json`

**Parameters**  
- `username` (string, required): The username of the subscriber to fetch.

**Example**  
GET `http://localhost:3000/subscribers/prek1`

**Response**  
Status: 200 OK  
Content-Type: `application/json`

**Description**  
Fetches the details of a specific subscriber based on the provided username.

---

## 3. Create a New Subscriber
**Request**  
POST `http://localhost:3000/subscribers`  
Content-Type: `application/json`

**Body**  
```json
{
  "username": "prek1",
  "expirationDate": "2024-09-20"
}
```

**Response**  
Status: 201 Created  
Content-Type: `application/json`

**Description**  
Creates a new subscriber with the given username and expiration date.

---

## 4. Update a Subscriber by Username
**Request**  
PATCH `http://localhost:3000/subscribers/{username}`  
Content-Type: `application/json`

**Parameters**  
- `username` (string, required): The username of the subscriber to update.

**Body**  
```json
{
  "expirationDate": "2024-12-30"
}
```

**Example**  
PATCH `http://localhost:3000/subscribers/prek5550`

**Response**  
Status: 200 OK  
Content-Type: `application/json`

**Description**  
Updates the expiration date of a specific subscriber.

---

## 5. Delete a Subscriber by Username
**Request**  
DELETE `http://localhost:3000/subscribers/{username}`

**Parameters**  
- `username` (string, required): The username of the subscriber to delete.

**Example**  
DELETE `http://localhost:3000/subscribers/prek1`

**Response**  
Status: 204 No Content

**Description**  
Deletes a specific subscriber based on the provided username.