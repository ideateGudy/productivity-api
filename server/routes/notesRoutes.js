import express from "express";
const router = express.Router();

import notesController from "../controllers/notesController.js";
const { getAllNotes, createNote, updateNote, deleteNote } = notesController;

router.get("/user/:user/:task/notes", getAllNotes);
router.post("/user/", createNote);
router.post("/task/:id", updateNote);
router.delete("/task/:id", deleteNote);

export default router;
