# Participant API Specifications

## Join to event

Endpoint: `POST /api/events/{eventId}/participants/join`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `201`

```json
{
  "status": "success",
  "message": "Participant Added",
  "data": {
    "participantId": "your_participant_id_after_successfully_added_to_an_event"
  }
}
```

Response `client-error`:

Status Code `400`:

```json
{
  "status": "fail",
  "message": "User already joined event"
}
```

Status Code `404`:

```json
{
  "status": "fail",
  "message": "Event not found"
}
```

## Accept participant who's joined an event by event owner

Endpoint: `POST /api/events/{eventId}/participants/{participantId}/accept`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code `200`:

```json
{
  "status": "success",
  "message": "Participant accepted"
}
```

Response `client-error`:

Status code `400`:

```json
{
  "status": "fail",
  "message": "User is not a participant of the event"
}
```

Status code `404`:

```json
{
  "status": "fail",
  "message": "Event not found"
}
```

## Decline participant who's want to join an event by event owner

Endpoint: `POST /api/events/{eventId}/participants/{userId}/decline`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code `200`:

```json
{
  "status": "success",
  "message": "Participant declined"
}
```

Response `client-error`:

Status Code `400`:

```json
{
  "status": "fail",
  "message": "User is not a participant of the event"
}
```

Status Code `404`:

```json
{
  "status": "fail",
  "message": "Event not found"
}
```

## Get all participants of an event

Endpoint: `GET /api/events/{eventId}/participants`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code `200`:

```json
{
  "status": "success",
  "message": "Successfully get event's participants",
  "data": [
    {
      "id": "participant_id",
      "user_id": "user_id",
      "event_id": "event_id",
      "accepted": true | false,
      "declined": true | false,
      "participate_at": "date_time",
      "user": {
        "email": "user_email",
        "name": "user_name",
        "profile": {
          "username": "user_username",
          "firstname": "user_firstname",
          "lastname": "user_lastname"
        }
      }
    }
  ]
}
```

## User attend an event

Endpoint: `POST /api/events/{eventId}/participants/{userId}/attend`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code `200`:

```json
{
  "status": "success",
  "message": "Participant attended"
}
```

Response `client-error`:

Status Code `400`:

```json
{
  "status": "fail",
  "message": "User is not a participant of the event"
}
```

Status Code `404`:

```json
{
  "status": "fail",
  "message": "Event not found"
}
```

## User not attend an event

Endpoint: `POST /api/events/{eventId}/participants/{userId}/absent`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code `200`:

```json
{
  "status": "success",
  "message": "Participant absent"
}
```

Response `client-error`:

Status Code `400`:

```json
{
  "status": "fail",
  "message": "User is not a participant of the event"
}
```

Status Code `404`:

```json
{
  "status": "fail",
  "message": "Event not found"
}
```
