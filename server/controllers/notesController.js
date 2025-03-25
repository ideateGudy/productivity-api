import Note from "../models/Note.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const handleErrors = (err) => {
  console.log(err.message, err.code, "here-----------------");

  const errors = {};

  //Check if a note already exist for task
  if (err.code === 11000) {
    errors.message =
      "A note for this task already exists. Each task can only have one note.";
    errors.code = 409;
  }

  //Check if UserId was inputed
  if (err.message === "userId is not defined") {
    errors.message = "userId is not defined";
    errors.code = 400;
  }

  // Validation Errors
  if (err.message.includes("Note validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log("properties---------", properties);

      errors[properties.path] = properties.message;
      errors.error = properties.path;
      errors.code = 400;
    });
  }

  return errors;
};

const filterFunc = async (res, task, notes) => {
  if (task) {
    console.log("----- Notes:", notes);

    // Filter notes based on taskId
    const filteredNotes = notes.filter(
      (note) => note.taskId.toString() === task._id.toString()
    );

    console.log("Filtered Notes: ", filteredNotes);
    return res.status(200).json({
      status: true,
      message: "Note retrieved by task ID",
      note: filteredNotes,
      task,
    });
  }

  res.status(404).json({ status: false, message: `Not found`, code: 404 });
};

/**  //TODO: To Create a Note a User must be Authenticated ✅
 *           Must be the Owner of the task to create or retrieve a note
 *           One Note per task
 *           Checklist Items are optional when creating a note
 *
 */

// Create a new note
const createNote = async (req, res) => {
  const { content, checklist } = req.body;
  const userIdFromToken = req.userId;
  const usernameFromToken = req.userName;
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId).populate("createdBy", "username");
    if (!task)
      return res.status(404).json({
        status: false,
        message: `Task does not exist. Cannot create note for task that does not exists`,
        code: 404,
      });

    const taskUserId = task.createdBy._id.toString();
    const creator = task.createdBy.username;
    // console.log(creator);
    // console.log(task);

    if (taskUserId !== userIdFromToken) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `Access Denied: You cannot create Note for this Task.`,
        creator,
        code: 403,
      };

      return res.status(403).send(response);
    }

    const note = await Note.create({
      content,
      taskId,
      userId: userIdFromToken,
      checklist,
    });

    const response = {
      status: true,
      message: `Note Created Successfully`,
      data: { note },
    };
    res.status(201).send(response);
  } catch (error) {
    // console.error("Error Registration: ", error);
    const err = handleErrors(error);

    const response = {
      status: false,
      message: err.message,
      code: err.code,
    };
    res.status(err.code).send(response);
  }
};

// Get a note by task ID
const getNoteByTaskId = async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const response = {
      status: false,
      currentUser: usernameFromToken,
      message: `Invalid ObjectId`,
      code: 404,
    };

    return res.status(404).send(response);
  }
  try {
    const task = await Task.findById(taskId).populate("createdBy", "username");
    console.log(task);
    const notes = await Note.find();

    const taskUserId = task.createdBy._id.toString();
    const userIdFromToken = req.userId;
    const usernameFromToken = req.userName;

    if (task.visibility === "private") {
      if (
        taskUserId !== userIdFromToken &&
        !task.authorizedUsers.includes(usernameFromToken)
      ) {
        const response = {
          status: false,
          currentUser: usernameFromToken,
          message: `Access Denied: Cannot View Note by Another User`,
          creator: task.createdBy.username,
          code: 403,
        };

        return res.status(403).send(response);
      }
      return filterFunc(res, task, notes);
    }

    // Check if the user is registered in the database
    if (task.visibility === "public_auth") {
      const users = await User.find({}, "username"); // Fetch only the username field
      const allUsers = users.map((user) => user.username); // Convert to an array of usernames

      if (allUsers.includes(usernameFromToken))
        return filterFunc(res, task, notes);
    }

    const response = {
      status: false,
      message: `Login to view this page`,
    };
    res.status(401).send(response);
  } catch (error) {
    // console.error("Error Registration: ", error);
    const err = handleErrors(error);

    const response = {
      status: false,
      message: err.message,
      code: err.code,
    };
    res.status(err.code).send(response);
  }
};

// Get all notes by a user
const getAllNotesByUser = async (req, res) => {
  const { userId } = req.params;
  const userIdFromToken = req.userId;
  const usernameFromToken = req.userName;
  console.log(userIdFromToken, userId);

  if (userId === null)
    return res
      .status(401)
      .json({ status: false, message: `UserId not specified` });

  if (userIdFromToken !== userId)
    return res.status(403).json({
      status: false,
      currentUser: usernameFromToken,
      message: `Access Denied: Login to view this page`,
      code: 403,
    });
  try {
    const notes = await Note.find({ userId })
      .populate("userId", "username")
      .populate("taskId", "title");

    if (!notes)
      return res
        .status(404)
        .json({ status: false, message: "Note does not Exixts", code: 404 });

    if (notes.length === 0)
      return res.status(200).json({
        status: true,
        message: `No Note has been Created by ${usernameFromToken}`,
        code: 200,
      });

    res.status(200).json({
      status: true,
      totalNumber: notes.length,
      message: "Notes retrieved by user",
      notes,
    });
  } catch (error) {
    // console.error("Error Registration: ", error);
    const err = handleErrors(error);

    const response = {
      status: false,
      message: err.message,
      code: err.code,
    };
    res.status(err.code).send(response);
  }
};

// Update a note
const updateNote = async (req, res) => {
  res.status(200).json({ message: "Note updated successfully", note: {} });
};

// Delete a note
const deleteNote = async (req, res) => {
  res.status(200).json({ message: "Note deleted successfully" });
};

// Update checklist item status
const updateChecklistItem = async (req, res) => {
  res
    .status(200)
    .json({ message: "Checklist item status updated", checklistItem: {} });
};

// Delete a checklist item
const deleteChecklistItem = async (req, res) => {
  res.status(200).json({ message: "Checklist item deleted successfully" });
};

// Export all functions
export {
  createNote,
  getNoteByTaskId,
  getAllNotesByUser,
  updateNote,
  deleteNote,
  updateChecklistItem,
  deleteChecklistItem,
};
