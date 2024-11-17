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
