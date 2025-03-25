import express from "express";
const router = express.Router();

// import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createNote,
  getNoteByTaskId,
  getAllNotesByUser,
  updateNote,
  deleteNote,
  updateChecklistItem,
  deleteChecklistItem,
} from "../controllers/notesController.js";

// Route to create a note for a task
router.post("/notes/:taskId", createNote); //Completed ✅

// Route to get a note linked to a specific task
router.get("/notes/task/:taskId", getNoteByTaskId); //Completed ✅ -- check authorizedUser Array && visibility ✅

// Route to get all notes created by a user
router.get("/notes/user/:userId", getAllNotesByUser); //Completed ✅ -- user can only access their own notes ✅

// Route to update a note's content
router.patch("/notes/:noteId", updateNote); //Completed ✅ -- only note creator can update ✅

// Route to update the status of a checklist item
router.patch(
  "/notes/:noteId/checklist/:checklistItemId",

  updateChecklistItem
); //Completed ✅

// Route to mark all checklist items as completed
// router.patch("/notes/:noteId/complete",  markChecklistComplete); //Not Started ❌

// Route to filter notes by checklist status
// router.get("/notes",  filterNotesByStatus); //Not Started ❌ -- query params to filter ✅

// Route to delete a checklist item
router.delete(
  "/notes/:noteId/checklist/:checklistItemId",

  deleteChecklistItem
); //Not Started ❌

// Route to delete a note
router.delete("/notes/:noteId", deleteNote); //Not Started ❌ -- only note creator can delete ✅

export default router;
