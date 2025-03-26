# NestJS Todo App with Authentication

A Todo application with authentication and session management built with NestJS.

## Features

- User authentication (register, login, logout)
- JWT token-based authentication with cookies
- Session management with remember me functionality
  - Sessions expire in 30 days if "remember me" is selected
  - Sessions expire in 1 day otherwise
- Session storage in the database
- Todo CRUD operations
- User profile management
- PostgreSQL database integration

## Technologies

- NestJS
- TypeORM
- PostgreSQL
- JWT
- Passport.js
- bcrypt

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/rajshiv169/nestjs-todo-auth.git
cd nestjs-todo-auth
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start PostgreSQL database (make sure PostgreSQL is installed and running)

6. Run the application
```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user info

### Users

- `GET /users/profile` - Get user profile

### Todos

- `GET /todos` - Get all todos for the logged-in user
- `POST /todos` - Create a new todo
- `GET /todos/:id` - Get a specific todo
- `PATCH /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Session Management

The application manages user sessions in the database. When a user logs in:

- A new session record is created in the database
- The session includes the user ID, session token, expiration time, and client info
- If the user selects "remember me", the session expires in 30 days
- Without "remember me", the session expires in 1 day
- JWTs are stored as HTTP-only cookies for security

## Environment Variables

Create a `.env` file with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=todo_app

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION_TIME=86400s
JWT_REMEMBER_ME_EXPIRATION=2592000s

# App Configuration
PORT=3000
NODE_ENV=development
```