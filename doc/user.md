# User API Specifications

## Register User

Endpoint: `POST /api/users`

Request Body:

```json
{
  "email": "upin@gmail.com",
  "phone": "081**********",
  "password": "abcdefgh"
}
```

Response `success`:

Status Code: `201`

```json
{
  "status": "success",
  "message": "User successfuly registered",
  "data": {
    "email": "upin@gmail.com"
  }
}
```

Response `user-already-registered`:

Status Code: `400`

```json
{
  "status": "fail",
  "message": "User already registered"
}
```

Response `client-error`:

Status Code: `400`

```json
{
  "status": "error",
  "message": "Bad Request",
  "errors": {
    "email": ["Email tidak valid"]
  }
}
```

## Login User

Endpoint: `POST /api/users/login`

Request Body:

```json
{
  // You can use either email or phone
  // But make sure you include one of them
  "email": "upin@gmail.com",
  "phone": "081*********",
  "password": "abcdefg"
}
```

Response `success`:

Status Code: `400`

```json
{
  "status": "success",
  "message": "Login success",
  "data": {
    "email": "upin@gmail.com",
    "token": "session_id_auto_generated"
  }
}
```

Response `fail`:

Status Code: `400`

```json
{
  "status": "fail",
  "message": "Login failed, Wrong credentials"
}
```

## Add Profile

Endpoint: `PUT /api/users/profile`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "username": "siupin",
  "firstname": "Upin",
  "lastname": "Apin"
}
```

Response `success`:

Status Code: `201`

```json
{
  "status": "success",
  "message": "Successfully added profile",
  "data": {
    "username": "siupin",
    "firstname": "Upin",
    "lastname": "Apin"
  }
}
```

Response `fail`:

Status Code: `400`

```json
{
  "status": "fail",
  "message": "Failed to add user profile"
}
```

Response `client-error`:

Status Code: `400`

```json
{
  "status": "error",
  "message": "Bad request",
  "errors": {
    "username": ["Username maximum 100 characters"]
  }
}
```

## Get User

Endpoint: `GET /api/users/me`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
    "status": "success",
    "message": "Successfully obtained user profile"
    "data": {
        "email": "upin@gmail.com",
        "phone": "081**********",
        "role": "USER",
        "profile": {}
    }
}
```

## Update User

Endpoint: `PUT /api/users`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "phone": "085*********"
}
```

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully update user information"
}
```

## Update User Profile

Endpoint: `PATCH /api/users/profile`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "username": "siapin", // optional, if want to change username
  "firstname": "Apin", // optional, if want to change firstname
  "lastname": "Upin" // optional, if want to change lastname
}
```

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully updated user profile"
}
```

Response `client-error`:

Status Code: `400`

```json
{
  "status": "error",
  "message": "Bad request",
  "errors": {
    "username": ["Username too short"]
  }
}
```

## Logout User

Endpoint: `DELETE /api/users/current`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully logout",
  "data": true
}
```
