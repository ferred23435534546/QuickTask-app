# QuickTask Backend

## Overview
Node.js backend server for QuickTask application. Provides RESTful API endpoints and database management.

## Features
- RESTful API endpoints
- PostgreSQL database integration
- JWT authentication
- Real-time updates with WebSocket
- Docker containerization

## Development
1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

## API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Technologies
- Node.js
- Express
- TypeScript
- PostgreSQL
- Docker 