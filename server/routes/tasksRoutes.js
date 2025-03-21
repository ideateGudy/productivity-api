import express from "express";
const router = express.Router();

import authMiddleware from "../middlewares/authMiddleware.js";
import tasksController from "../controllers/tasksController.js";

const {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = tasksController;

// Route to get all tasks
router.get("/tasks", authMiddleware, getAllTasks);

// Route to get a specific task by ID
router.get("/tasks/:taskId", authMiddleware, getTask);

// Route to create a task
router.post("/task", authMiddleware, createTask);

// Route to update the task
router.patch("/task/:taskId", authMiddleware, updateTask);

// Route to update the task status
router.patch("/task/:taskId/status", authMiddleware, updateTaskStatus);

// Route to delete the task
router.delete("/task/:taskId", authMiddleware, deleteTask);

export default router;
