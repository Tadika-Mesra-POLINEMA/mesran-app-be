# Chat API Specifications

## Create a new Chat Room

Endpoint: `POST /api/chatrooms`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "isGroup": true // it can be true or false
}
```

Response `success`:

Status Code: `201`

```json
{
  "status": "success",
  "message": "Successfully create chat room"
}
```

## Send a message

Endpoint: `POST /api/chatrooms/{chatroomId}/messages`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "content": "Hi there, it's me upin"
}
```

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully send a message"
}
```

Response `not-found-client-error`:

Status Code: `404`

```json
{
  "status": "fail",
  "message": "Cannot send a message, Chatroom not found"
}
```

## Get messages

Endpoint: `GET /api/chatromms/{chatroomId}/messages`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully retrieve all message from chatroom",
  "data": {
    "messages": [
      {
        "id": "uuid",
        "user": {
          // user information
        },
        "content": "message",
        "createdAt": "created_at_datetime",
        "updatedAt": "created_at_datetime"
      }
    ]
  }
}
```

## Delete a message

Endpoint: `DELETE /api/chatrooms/{chatroomId}/messages/{messageId}`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully delete a message content"
}
```

Response `not-found-client-error`:

Status Code: `404`

```json
{
  "status": "fail",
  "message": "Cannot delete a message content, Chatroom not found"
}
```

```json
{
  "status": "fail",
  "message": "Cannot delete a message content, Message not found"
}
```
