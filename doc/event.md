# Event API Specifications

## Create an Event

Endpoint: `POST /api/events`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "data": {
    "event": {
      "name": "Birthday",
      "description": "Mari kita rayakan ultah upin",
      "date": "2024-10-24",
      "start": "2024-10-24T07:00:00.853Z",
      "dress": "choose_your_dress_in_app",
      "theme": "Halloween",
      "location": "Rumah Upin"
    }
  }
}
```

Response `success`:

Status Code: `201`

```json
{
  "status": "success",
  "message": "Successfully create an event",
  "data": {
    "event": {
      "name": "Birthday",
      "description": "Mari kita rayakan ultah upin",
      "date": "2024-10-24",
      "start": "2024-10-24T07:00:00.853Z",
      "dress": "Halloween",
      "venue": "Rumah Upin"
    }
  }
}
```

Response `client-error`:

Status Code: `400`

```json
{
  "status": "error",
  "message": "Bad request",
  "errors": {
    "name": ["Event name is too long, Maximum 100 character"],
    "description": ["Description is too long, Maximum 120 character"]
  }
}
```

## Get all event

Endpoint: `GET /api/events`

Role: ADMIN

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully retrieve all event",
  "data": {
    "events": [
      {
        "id": "uuid",
        "owner": "uuid",
        "name": "Birthday",
        "description": "Mari kita rayakan ultah upin",
        "target_date": "2024-10-24",
        "event_start": "2024-10-24T07:00:00.853Z",
        "theme": "Halloween",
        "dress": "choosed_dress_in_app",
        "location": "Rumah Upin",
        "member_count": 0,
        "is_done": false,
        "created_at": "created_date",
        "updated_at": "updated_date",
        "owner": {
          "email": "upin@gmail.com",
          "phone": "081**********",
          "role": "USER",
          "profile": {}
        },
        "event_activities": [
          {
            "id": "uuid",
            "eventId": "uuid",
            "title": "Meniup lilin",
            "description": "Melakukan peniupan lilin oleh upin",
            "activityStart": "activity_start_date",
            "activityEnd": "activity_end_date"
          }
        ],
        "event_participants": [
          {
            "email": "upin@gmail.com",
            "phone": "081**********",
            "role": "USER",
            "profile": {}
          }
        ]
      }
    ]
  }
}
```

## Get event on specific user

Endpoint: `GET /api/users/{userId}/events`

Role: ADMIN

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully obtained user event",
  "data": {
    "events": [
      {
        "id": "uuid",
        "owner": "uuid",
        "name": "Birthday",
        "description": "Mari kita rayakan ultah upin",
        "target_date": "2024-10-24",
        "event_start": "2024-10-24T07:00:00.853Z",
        "theme": "Halloween",
        "dress": "choosed_dress_in_app",
        "location": "Rumah Upin",
        "member_count": 0,
        "is_done": false,
        "created_at": "created_date",
        "updated_at": "updated_date",
        "owner": {
          "email": "upin@gmail.com",
          "phone": "081**********",
          "role": "USER",
          "profile": {}
        },
        "event_activities": [],
        "event_participants": [
          {
            "email": "upin@gmail.com",
            "phone": "081**********",
            "role": "USER",
            "profile": {}
          }
        ]
      }
    ]
  }
}
```

Response `user-not-found`:

Status Code: `404`

```json
{
  "status": "fail",
  "message": "Cannot obtain user events, The user is not found"
}
```

## Get events on current user

Endpoint: `GET /api/events`

Role: USER

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully obtained user events",
  "data": {
    "events": [
      {
        "id": "uuid",
        "name": "Birthday",
        "description": "Mari kita rayakan ultah upin",
        "target_date": "2024-10-24",
        "event_start": "2024-10-24T07:00:00.853Z",
        "location": "Rumah Upin",
        "theme": "Halloween",
        "dress": "choosed_dress_in_app",
        "member_count": 0,
        "is_done": false,
        "created_at": "created_date",
        "updated_at": "updated_date",
        "owner": {
          "email": "upin@gmail.com",
          "phone": "081**********",
          "role": "USER",
          "profile": {}
        },
        "event_activities": [],
        "event_participants": [
          {
            "email": "upin@gmail.com",
            "phone": "081**********",
            "role": "USER",
            "profile": {}
          }
        ]
      }
    ]
  }
}
```

## Update event by owner

Endpoint: `PUT /api/events/{eventId}`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "name": "Birthday Upin", // optional
  "description": "This is the new birthday description", // optional
  "eventStart": "new_datetime_event_start", // optional
  "eventEnd": "new_datetime_event_end", // optional
  "location": "Rumah Opan", // optional
  "dress": "Halloween"
}
```

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully update an event"
}
```

## Cancel the event by owner

Endpoint: `PUT /api/events/{eventId}/cancel`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully cancel event"
}
```

Response `not-found-client-error`:

Status Code: `404`

```json
{
  "status": "fail",
  "message": "Cannot cancel event, Event not found"
}
```

## Delete event by owner

Endpoint: `DELETE /api/events/{eventId}`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully delete event"
}
```

Response `not-found-client-error`:

Status Code: `404`

```json
{
  "status": "fail",
  "message": "Cannot delete event, Event not found"
}
```

## Add event activities

Endpoint: `POST /api/events/{eventId}/activities`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "title": "Meniup lilin",
  "description": "Upin akan meniup lilin",
  "activity_start": "activity_start_time",
  "activity_end": "activity_end_time"
}
```

Response `success`:

Status Code: `201`

```json
{
  "status": "success",
  "message": "Successfully create an activity",
  "data": {
    "activity": {
      "id": "uuid",
      "title": "Meniup lilin",
      "description": "Upin akan meniup lilin",
      "activity_start": "activity_start_time",
      "activity_end": "activity_end_time",
      "createdAt": "created_at_datetime",
      "updatedAt": "updated_at_datetime"
    }
  }
}
```

Response `bad-request-client-error`:

Status Code: `400`

```json
{
  "status": "error",
  "message": "Bad request",
  "errors": {
    "description": ["Description is too short"]
  }
}
```

Response `not-found-client-error`:

Status Code: `404`

```json
{
  "status": "fail",
  "message": "Cannot update event activity, Event not found"
}
```

## Get event activities

Endpoint: `GET /api/event/{eventId}/activities`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

```json
{
  "status": "success",
  "message": "Successfully obtained event activities",
  "data": {
    "activities": [
      {
        "id": "uuid",
        "title": "Meniup lilin",
        "description": "Upin akan meniup lilin",
        "activity_start": "activity_start_time",
        "activity_end": "activity_end_time",
        "createdAt": "created_at_datetime",
        "updatedAt": "updated_at_datetime"
      }
    ]
  }
}
```

## Update activity of an event by owner

Endpoint: `PUT /api/event/{eventId}/activities/{activityId}`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Request Body:

```json
{
  "title": "new title",
  "description": "new activity description",
  "activity_start": "activity_start_datetime",
  "activity_end": "activity_end_datetime"
}
```

Response `success`:

Status Code: `200`

```json
{
  "status": "success",
  "message": "Successfully update an event activity",
  "data": {
    "activity": {
      "id": "uuid",
      "title": "new title",
      "description": "new activity description",
      "activity_start": "activity_start_datetime",
      "activity_end": "activity_end_datetime"
    }
  }
}
```

Response `bad-request-client-error`:

Status Code: `400`

```json
{
  "status": "error",
  "message": "Bad request",
  "errors": {
    "description": ["Description is too long"]
  }
}
```

Response `not-found-client-error`:

Status Code: `404`

```json
{
  "status": "fail",
  "message": "Cannot update an activity, Event not found"
}
```

```json
{
  "status": "fail",
  "message": "Cannot update an activity, Activity not found"
}
```

## Delete an activity

Endpoint: `DELETE /api/event/{eventId}/activities/{activityId}`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Response `success`:

```json
{
  "status": "success",
  "message": "Successfully delete an event activity"
}
```

Response `not-found-client-error`:

```json
{
  "status": "fail",
  "message": "Cannot delete an activity, Event not found"
}
```

```json
{
  "status": "fail",
  "message": "Cannot delete an activity, Activity not found"
}
```
