# NestJS Todo API Backend

A robust Todo API built with NestJS, MongoDB, and JWT authentication for a React Native mobile application.

## 🚀 Features

- **User Authentication**: Register, login, and JWT-based authentication
- **Todo Management**: CRUD operations for todos with priorities and deadlines
- **Advanced Sorting**: Custom algorithm mixing deadline, priority, and time
- **Health Checks**: Built-in health
- **Rate Limiting**: Protection against abuse
- **Type Safety**: Full TypeScript implementation
- **Data Validation**: Request validation with class-validator

## 📋 Prerequisites

- Node.js 18+
- MongoDB 4.4+
- Docker & Docker Compose (optional)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd todo-backend

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configurations
# Make sure to change JWT_SECRET in production!
```

### 3. Database Setup

**Option A: Local MongoDB**

```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: Docker MongoDB**

```bash
# Start MongoDB with Docker
docker run -d --name mongodb -p 27017:27017 mongo:7-jammy
```

## 🚀 Running the Application

### Development Mode

```bash
# Start in development mode with auto-reload
npm run start:dev

# The API will be available at http://localhost:3000/api
```

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Using Docker Compose

```bash
# Start all services (API + MongoDB + Mongo Express)
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down
```

## 🔍 Health Check

The application includes health check endpoints for monitoring:

```bash
# Full health check
curl http://localhost:3000/api/health

# Simple ping
curl http://localhost:3000/api/health/ping
```

## 📚 API Documentation

See the [API Endpoints Documentation](./API_ENDPOINTS.md) for detailed information about all available endpoints.

### Quick Test

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login (copy the access_token from response)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Create a todo (replace YOUR_JWT_TOKEN)
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Test Todo",
    "description": "This is a test todo",
    "priority": "high",
    "deadline": "2024-12-31T23:59:59Z"
  }'
```

## 📁 Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── dto/             # Data transfer objects
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── jwt.strategy.ts
├── todo/                # Todo module
│   ├── dto/
│   ├── todo.controller.ts
│   ├── todo.service.ts
│   └── todo.module.ts
├── schemas/             # MongoDB schemas
│   ├── user.schema.ts
│   └── todo.schema.ts
├── health/              # Health check
│   └── health.controller.ts
├── app.module.ts        # Root module
└── main.ts             # Application entry point
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Configurable request throttling
- **Input Validation**: Comprehensive request validation
- **CORS**: Configurable cross-origin resource sharing

## 🌟 Advanced Features

### Custom Sorting Algorithm

The API includes a sophisticated sorting algorithm that combines:

- **Deadline urgency**: Tasks closer to deadline get higher priority
- **Priority weights**: High (3), Medium (2), Low (1)
- **Time-based scoring**: Recent tasks get slight preference

### Todo Statistics

Get comprehensive statistics about your todos:

```bash
curl -X GET http://localhost:3000/api/todos/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```


## 📝 Environment Variables

| Variable      | Description               | Default                                |
| ------------- | ------------------------- | -------------------------------------- |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/todo-app`   |
| `JWT_SECRET`  | JWT signing secret        | `your-secret-key-change-in-production` |
| `PORT`        | Server port               | `3000`                                 |
| `NODE_ENV`    | Environment mode          | `development`                          |
