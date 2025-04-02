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


## Flow of Actions
This API allows users to register, log in, manage tasks, and collaborate on tasks by granting or revoking access.


1. User Registration

User sends a request to /register with their details.

API creates a new user and stores credentials securely.



2. User Login

User sends credentials to /login.

API verifies credentials and issues a JWT token.

Token is stored in the client for authentication.



3. User Logout

User sends a request to /logout/:id with their token.

API revokes the token, preventing further access.



4. Retrieve All Users (Admin Only)

Admin sends a request to /users.

API verifies admin role and returns the list of users.



5. Task Management

User creates a task by sending data to /tasks.

Task is stored with user as owner.

User retrieves all tasks with /tasks.

User retrieves a specific task with /tasks/:taskId.

User updates a task with /tasks/:taskId.

User updates task status with /tasks/:taskId/status.

User deletes a task with /tasks/:taskId.



6. Task Permissions

Task owner grants another user access with /tasks/:taskId/authorize.

Task owner revokes user access with /tasks/:taskId/revoke.

Task owner updates task visibility (private, public_auth, public_all) via /tasks/:taskId/visibility.



7. Notes Management

User creates a note for a task with /notes/:taskId.

User retrieves notes for a task via /notes/task/:taskId.

User retrieves all notes they created via /notes/user/:userId.

User updates a note with /notes/:noteId.

User updates a checklist item in a note via /notes/:noteId/checklist/:checklistItemId.

User deletes a checklist item via /notes/:noteId/checklist/:checklistItemId.

User deletes a note with /notes/:noteId.




### Authentication & Authorization

JWT-based authentication ensures only authorized users access protected routes.

Admins have additional privileges such as viewing all users.

Task owners control task permissions and visibility settings.


### Error Handling

Missing or invalid tokens return authentication errors.

Unauthorized access to tasks and notes returns appropriate error messages.

All API responses follow a standard JSON format with status and messages.



### Contribution

Feel free to contribute to this project by creating issues or submitting pull requests.

### License

This project is licensed under the MIT License.

 
