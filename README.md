# Task and Note Management Flow

This document outlines the flow for creating tasks, notes, and managing checklist items, including their statuses ("pending", "in-progress", or "completed"). It also includes the backend endpoints for each step in the flow.

---

### Flow:

#### 1. **User Creates a Task:**

- A user creates a task with a **title**, **description**, and **optional attachments**. The task is saved with a unique **task ID**.

**Endpoint:**

- `POST /api/tasks`

**Request Body:**

```json
{
  "title": "Complete API Documentation",
  "description": "Write API documentation for the project",
  "userId": "user_id", // Reference to the user
  "attachments": [] // Optional
}
```

{
"taskId": "unique_task_id",
"status": "pending"
} 2. User Creates a Note with a Checklist:
A user creates a note linked to a task. The note contains a checklist with items, each with a status ("pending", "in-progress", or "completed").
Endpoint:

POST /api/notes
Request Body:

json
Copy
Edit
{
"content": "This is a note with a checklist",
"taskId": "task_id", // Reference to the task
"userId": "user_id", // Reference to the user
"checklist": [
{ "text": "Complete task description", "status": "pending" },
{ "text": "Update task status", "status": "in-progress" },
{ "text": "Review attachments", "status": "completed" }
]
} 3. User Views Task with Notes:
A user views a task and its associated notes, including the checklist items with their current statuses.
Endpoint:

GET /api/tasks/:taskId
Response:

json
Copy
Edit
{
"taskId": "task_id",
"title": "Complete API Documentation",
"description": "Write API documentation for the project",
"status": "pending",
"notes": [
{
"noteId": "note_id",
"content": "This is a note with a checklist",
"checklist": [
{ "text": "Complete task description", "status": "pending" },
{ "text": "Update task status", "status": "in-progress" },
{ "text": "Review attachments", "status": "completed" }
]
}
]
} 4. User Updates Checklist Item Status:
The user can update the status of individual checklist items (e.g., from "pending" to "completed").
Endpoint:

PATCH /api/notes/:noteId/checklist/:checklistItemId
Request Body:

json
Copy
Edit
{
"status": "completed"
}
Response:

json
Copy
Edit
{
"status": "success",
"updatedChecklistItem": {
"text": "Complete task description",
"status": "completed"
}
} 5. User Views Updated Task with Notes and Checklist:
Once the status of checklist items is updated, the user can view the task and updated checklist items with their new statuses.
Endpoint:

GET /api/tasks/:taskId
Response:

json
Copy
Edit
{
"taskId": "task_id",
"title": "Complete API Documentation",
"description": "Write API documentation for the project",
"status": "in-progress",
"notes": [
{
"noteId": "note_id",
"content": "This is a note with a checklist",
"checklist": [
{ "text": "Complete task description", "status": "completed" },
{ "text": "Update task status", "status": "in-progress" },
{ "text": "Review attachments", "status": "completed" }
]
}
]
} 6. User Filters Notes by Checklist Status:
Users can filter notes based on checklist item statuses (e.g., show only "completed" items).
Endpoint:

GET /api/notes?status=completed
Response:

json
Copy
Edit
[
{
"noteId": "note_id",
"content": "This is a note with a checklist",
"checklist": [
{ "text": "Complete task description", "status": "completed" }
]
}
] 7. User Marks All Checklist Items as Completed:
A user can mark all checklist items in a note as "completed".
Endpoint:

PATCH /api/notes/:noteId/complete
Response:

json
Copy
Edit
{
"status": "success",
"message": "All checklist items marked as completed."
} 8. User Deletes a Checklist Item:
If a checklist item is no longer needed, the user can delete it.
Endpoint:

DELETE /api/notes/:noteId/checklist/:checklistItemId
Response:

json
Copy
Edit
{
"status": "success",
"message": "Checklist item deleted."
}

Summary of Flow:
Create Task: A user creates a task with a title, description, and status.
Create Note with Checklist: A user adds a note with a checklist linked to a task. Each checklist item has a status that can be "pending", "in-progress", or "completed".
View Notes: The user views the task and its notes, including the checklist items and their status.
Update Checklist Status: The user can update the status of individual checklist items.
Filter by Status: The user can filter and search for checklist items based on their status (e.g., show only "completed" items).
Complete Checklist: The user can mark all checklist items as completed when the task is finished.
Delete Checklist Item: The user can delete individual checklist items if no longer needed.
This flow allows a user to create tasks and manage notes with checklist items, updating and filtering their status as needed.
