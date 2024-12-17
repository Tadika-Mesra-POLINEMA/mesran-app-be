# Notification API Specifications

## Get User Notifications

Endpoint: `GET /api/notifications`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully get user notifications",
  "data": [
    {
      "id": "notification_id",
      "event_id": "event_id",
      "content": "notification_content",
      "type": "MESSAGE" | "ALERT" | "REMINDER" | "CONFIRMATION",
      "sender": {
        //...user-profile
      },
      "recipient": {
        //...user-profile
      },
      "sent_at": "sent_at",
      "created_at": "created_at",
    }
  ]
}
```
