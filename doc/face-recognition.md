# Face Recognition API Specifications

## Register Faces

Endpoint: `POST /api/users/faces`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

`Form-Data`

| Param        | Value  |
| ------------ | ------ |
| faces `File` | images |

`Json`

```json
{
  "faces": [
    {
      "image": "base64_image",
      "label": "label"
    }
  ]
}
```

Response `success`:

Status Code: `201`

```json
{
  "status": "success",
  "message": "Successfully register user faces"
}
```

Response `client-error`:

Status Code: `400`

```json
{
  "status": "fail",
  "message": "No faces found"
}
```

## Predict User Face

Endpoint: `POST /api/users/faces/predict`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

`Form-Data`

| Param       | Value |
| ----------- | ----- |
| face `File` | image |

`Json`

```json
{
  "face": "base64_image"
}
```

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully predict user face",
  "data": {
    "id": "user_id",
    "email": "upin@gmail.com",
    "phone": "081**********",
    "role": "USER",
    "profile": {
      "username": "upin",
      "firstname": "Upin Ipin",
      "lastname": ""
    }
  }
}
```

Response `client-error`:

Status Code: `400`

```json
{
  "status": "fail",
  "message": "No face found"
}
```

Status Code: `404`

```json
{
  "status": "fail",
  "message": "User not found"
}
```
