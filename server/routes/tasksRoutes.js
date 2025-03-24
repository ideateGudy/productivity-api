import express from "express";
const router = express.Router();

// import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  giveUserAccess,
  revokeUserAccess,
  visibilityStatus,
} from "../controllers/tasksController.js";

// -------ALLWAYS CHECK THE VISIBILITY STATUS OF A TASK BEFORE DESPLAYING TO THE APPROPRIATE AUDIENCE--------❌✅

// Route to get all tasks
router.get("/tasks", getAllTasks); //Done✅

// Route to get a specific task by ID
router.get("/tasks/:taskId", getTask); //Done✅ -- check authorizedUser Array && visiblility ✅

// Route to create a task
router.post("/tasks", createTask); //Done✅

// Route to update the task
router.patch("/tasks/:taskId", updateTask); //Done✅

// Route to update the task status
router.patch("/tasks/:taskId/status", updateTaskStatus); //Done✅

// Route to delete the task
router.delete("/tasks/:taskId", deleteTask); //Done✅

//------------Authorization Permissions Routes By Task Owners Only-----------

// Route to allow another (ADD USER) user to view a task by adding them to the "authorizedUsers" array
router.patch("/tasks/:taskId/authorize", giveUserAccess); //Done✅

// Route to revoke another (REMOVE USER) user from viewing a task by removing them from the "authorizedUsers" array
router.patch("/tasks/:taskId/revoke", revokeUserAccess); //Done✅

// Route to allow task creator to update the task visibility ["private", "public_auth", "public_all"]
//private: only creators and authorized users
//public_auth: only authenticated users (logged-in)
//public_all: everyone + unauthenticated users (not logged-in)
router.patch("/tasks/:taskId/visibility", visibilityStatus); //Done✅

export default router;
