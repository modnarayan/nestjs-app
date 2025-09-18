# Todo API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "access_token": "jwt_token_here"
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

## Todo Endpoints

### Create Todo
```http
POST /api/todos
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo app backend",
  "priority": "high",
  "deadline": "2024-12-31T23:59:59Z"
}
```

### Get All Todos
```http
GET /api/todos?status=pending&priority=high&sortBy=deadline&sortOrder=asc
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status`: "pending" | "completed"
- `priority`: "low" | "medium" | "high"
- `sortBy`: "createdAt" | "deadline" | "priority"
- `sortOrder`: "asc" | "desc"

### Get Todo Stats
```http
GET /api/todos/stats
Authorization: Bearer <jwt_token>
```

### Get Sorted Todos (Custom Algorithm)
```http
GET /api/todos/sorted
Authorization: Bearer <jwt_token>
```

### Get Single Todo
```http
GET /api/todos/:id
Authorization: Bearer <jwt_token>
```

### Update Todo
```http
PATCH /api/todos/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "completed",
  "priority": "medium"
}
```

### Delete Todo
```http
DELETE /api/todos/:id
Authorization: Bearer <jwt_token>
```

## Health Check Endpoints

### Full Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "database": {
    "status": "connected",
    "name": "todo-app"
  },
  "memory": {
    "rss": 50000000,
    "heapTotal": 30000000,
    "heapUsed": 20000000
  },
  "version": "v18.17.0"
}
```

### Simple Ping
```http
GET /api/health/ping
```

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Todo not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

## Priority Levels
- `low`: Low priority task
- `medium`: Medium priority task (default)
- `high`: High priority task

## Task Status
- `pending`: Task is not completed (default)
- `completed`: Task is completed

## Custom Sorting Algorithm
The `/api/todos/sorted` endpoint uses a custom algorithm that combines:
1. **Deadline urgency**: Closer deadlines get higher priority
2. **Task priority**: High/Medium/Low priority weights
3. **Creation time**: Recent tasks get slight preference

Formula: `urgency_score = days_until_deadline - (priority_weight * 2)`
Lower scores appear first (more urgent).