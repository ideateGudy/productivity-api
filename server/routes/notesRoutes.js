import express from "express";
const router = express.Router();

import notesController from "../controllers/notesController.js";
const { getAllNotes, createNote, updateNote, deleteNote } = notesController;

router.get("/users/:user/:task/notes", getAllNotes);
router.post("/users/", createNote);
router.post("/tasks/:id", updateNote);
router.delete("/tasks/:id", deleteNote);

export default router;
