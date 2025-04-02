Task Management API

Overview

This is a RESTful API for a task management system that allows users to manage tasks, notes, and authentication. The API supports user authentication, task visibility management, authorization controls, and note management.

Features

User authentication (Register, Login, Logout)

Task management (Create, Read, Update, Delete)

Task visibility and authorization

Notes and checklist management

Role-based access control with admin and user roles


Technologies Used

Node.js

Express.js

JWT Authentication

Redis (Token revocation)

MongoDB (Database)


Installation

1. Clone the repository:

git clone https://github.com/yourusername/task-management-api.git
cd task-management-api


2. Install dependencies:

npm install


3. Set up environment variables in a .env file:

JWT_SECRET=your_secret_key
REDIS_URL=your_redis_connection


4. Start the server:

npm start



API Endpoints

## API Endpoints

### Authentication  
| Method | Endpoint     | Description            |
|--------|-------------|------------------------|
| POST   | /register   | Register a new user   |
| POST   | /login      | User login            |
| POST   | /logout/:id | Logout user           |

### User Management (Admin Only)  
| Method | Endpoint  | Description       |
|--------|----------|-------------------|
| GET    | /users   | Get all users     |

### Task Management  
| Method | Endpoint                     | Description                                |
|--------|-----------------------------|--------------------------------------------|
| GET    | /tasks                      | Get all tasks                             |
| GET    | /tasks/:taskId              | Get a specific task                       |
| POST   | /tasks                      | Create a new task                         |
| PATCH  | /tasks/:taskId              | Update a task                             |
| PATCH  | /tasks/:taskId/status       | Update task status                        |
| DELETE | /tasks/:taskId              | Delete a task                             |

### Task Authorization & Visibility  
| Method | Endpoint                        | Description                                  |
|--------|----------------------------------|----------------------------------------------|
| PATCH  | /tasks/:taskId/authorize        | Authorize a user to access a task           |
| PATCH  | /tasks/:taskId/revoke           | Revoke a user's access to a task            |
| PATCH  | /tasks/:taskId/visibility       | Set task visibility (private, public_auth, public_all) |

### Notes Management  
| Method | Endpoint                               | Description                              |
|--------|---------------------------------------|------------------------------------------|
| POST   | /notes/:taskId                       | Create a note for a task                |
| GET    | /notes/task/:taskId                  | Get notes for a specific task           |
| GET    | /notes/user/:userId                  | Get all notes created by a user         |
| PATCH  | /notes/:noteId                       | Update a note                           |
| PATCH  | /notes/:noteId/checklist/:checklistItemId | Update checklist item status      |
| DELETE | /notes/:noteId/checklist/:checklistItemId | Delete a checklist item            |
| DELETE | /notes/:noteId                       | Delete a note                           |

Authentication Middleware

The API uses JWT authentication with middleware for verifying tokens and handling user authorization. Revoked tokens are stored in Redis for session invalidation.

Contribution

Feel free to contribute to this project by creating issues or submitting pull requests.

License

This project is licensed under the MIT License.

 
