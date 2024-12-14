# User API Specifications

## Register User

Endpoint: `POST /api/users`

Request Body:

```json
{
  "name": "Upin Ipin",
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
    "email": "upin@gmail.com",
    "accessToken": "your_access_token",
    "refreshToken": "your_refresh_token"
  }
}
```

Response `user-already-registered`:

Status Code: `400`

```json
{
  "status": "fail",
  "message": "Email already registered"
}
```

```json
{
  "status": "fail",
  "message": "Phone already registered"
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

Endpoint: `POST /api/authentications`

Request Body:

```json
{
  "email": "upin@gmail.com",
  "password": "abcdefg"
}
```

Response `success`:

Status Code: `200`:

```json
{
  "status": "success",
  "message": "User successfully logged in, please use the otp code and provide verification key to claim your access token",
  "data": {
    "verificationKey": "generated_key",
    "otp": "otp_code"
  }
}
```

Response `fail`:

Status Code: `400`, Not put email

```json
{
  "status": "fail",
  "message": "You need to put email"
}
```

Status Code: `400`, Invalid email or phone and or password

```json
{
  "status": "fail",
  "message": "Credentials not match."
}
```

## Verify Your Otp

Endpoint: `POST /api/authentications/verify-login`

Request Body:

```json
{
  "verificationKey": "verification_key",
  "otp": "123456"
}
```

Response `success`:

```json
{
  "status": "success",
  "message": "User successfully logged in",
  "data": {
    "email": "upin@gmail.com",
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
}
```

`Nb`: You can use the token to access the protected routes

Response `fail`:

Status Code: `400`, Otp not found or expired

```json
{
  "status": "fail",
  "message": "OTP is expired."
}
```

Status Code: `400`, Otp not match

```json
{
  "status": "fail",
  "message": "OTP is not match."
}
```

## Renew Access Token

Endpoint: `PUT /api/authentications/refresh`

Request Body:

```json
{
  "refreshToken": "your_refresh_token"
}
```

Response `success`:

```json
{
  "status": "success",
  "message": "Successfully renew access token",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

Response `client-error`:

Status Code: `400`

```json
{
  "status": "error",
  "message": "message"
}
```

## Logout User

Endpoint: `DELETE /api/authentications`

Request Body:

```json
{
  "refreshToken": "your_refresh_token"
}
```

Response `success`:

```json
{
  "status": "success",
  "message": "Successfully logout."
}
```

Response `fail`:

Status Code: `400`:

```json
{
  "status": "fail",
  "message": "Token not found."
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
  "username": "siapin",
  // optional, if want to change username
  "firstname": "Apin",
  // optional, if want to change firstname
  "lastname": "Upin"
  // optional, if want to change lastname
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
