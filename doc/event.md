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
      "end": "2024-10-24T012:00:00.853Z",
      "dress": "dress_id",
      "venue": "Rumah Upin",
      "cover": {
        "color": "yellow",
        "type": "line"
      }
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
      "end": "2024-10-24T012:00:00.853Z",
      "dress": "dress_id",
      "venue": "Rumah Upin",
      "cover": {
        "color": "yellow",
        "type": "line"
      }
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
        "targetDate": "2024-10-24",
        "eventStart": "2024-10-24T07:00:00.853Z",
        "eventEnd": "2024-10-24T012:00:00.853Z",
        "dress": "uuid",
        "venue": "Rumah Upin",
        "coverColor": "yellow",
        "coverType": "line",
        "memberCount": 0,
        "isDone": false,
        "createdAt": "created_date",
        "updatedAt": "updated_date",
        "eventOwner": {
          "email": "upin@gmail.com",
          "phone": "081**********",
          "role": "USER",
          "profile": {}
        },
        "eventDress": {
          "id": "uuid",
          "name": "Dress Name"
        },
        "eventActivities": [
          {
            "id": "uuid",
            "eventId": "uuid",
            "title": "Meniup lilin",
            "description": "Melakukan peniupan lilin oleh upin",
            "activityStart": "activity_start_date",
            "activityEnd": "activity_end_date"
          }
        ],
        "eventParticipants": [
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
        "targetDate": "2024-10-24",
        "eventStart": "2024-10-24T07:00:00.853Z",
        "eventEnd": "2024-10-24T012:00:00.853Z",
        "dress": "uuid",
        "venue": "Rumah Upin",
        "coverColor": "yellow",
        "coverType": "line",
        "memberCount": 0,
        "isDone": false,
        "createdAt": "created_date",
        "updatedAt": "updated_date",
        "eventOwner": {
          "email": "upin@gmail.com",
          "phone": "081**********",
          "role": "USER",
          "profile": {}
        },
        "eventDress": {
          "id": "uuid",
          "name": "Dress Name"
        },
        "eventActivities": [],
        "eventParticipants": [
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
        "owner": "uuid",
        "name": "Birthday",
        "description": "Mari kita rayakan ultah upin",
        "targetDate": "2024-10-24",
        "eventStart": "2024-10-24T07:00:00.853Z",
        "eventEnd": "2024-10-24T012:00:00.853Z",
        "dress": "uuid",
        "venue": "Rumah Upin",
        "coverColor": "yellow",
        "coverType": "line",
        "memberCount": 0,
        "isDone": false,
        "createdAt": "created_date",
        "updatedAt": "updated_date",
        "eventOwner": {
          "email": "upin@gmail.com",
          "phone": "081**********",
          "role": "USER",
          "profile": {}
        },
        "eventDress": {
          "id": "uuid",
          "name": "Dress Name"
        },
        "eventActivities": [],
        "eventParticipants": [
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

Endpoint: `PATCH /api/events/{eventId}`

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
  "venue": "Rumah Opan" // optional
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
  "activityStart": "activity_start_time",
  "activityEnd": "activity_end_time"
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
      "activityStart": "activity_start_time",
      "activityEnd": "activity_end_time",
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
        "activityStart": "activity_start_time",
        "activityEnd": "activity_end_time",
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
  "activityStart": "activity_start_datetime",
  "activityEnd": "activity_end_datetime"
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
      "activityStart": "activity_start_datetime",
      "activityEnd": "activity_end_datetime"
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

## Update event dress

Endpoint: `PUT /api/event/{eventId}/dress?dresscode=dresscode_id`

Headers:

| Param         | Value          |
| ------------- | -------------- |
| Authorization | Bearer `token` |

Query:

| Param     | Value        |
| --------- | ------------ |
| dresscode | dresscode_id |

Response `success`:

```json
{
  "status": "success",
  "message": "Successfully set the used dresscode"
}
```

Response `not-found-client-error`:

```json
{
  "status": "fail",
  "message": "Cannot set the dresscode, Event not found"
}
```

```json
{
  "status": "fail",
  "message": "Cannot set the dresscode, Dresscode not found"
}
```
