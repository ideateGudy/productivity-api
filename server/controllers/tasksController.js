import Task from "../models/Task.js";
import mongoose from "mongoose";

const handleErrors = (err) => {
  console.log(err.message, err.code, "here-----------------");

  const errors = {};

  //Validation Errors
  if (err.message.includes("Task validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log("properties---------", properties);
      errors[properties.path] = properties.message;
      errors.statusCode = 400;
    });
  }

  return errors;
};

//----------------------Get All Tasks--------------------------------------------------

const getAllTasks = async (req, res) => {
  const user = req.userId;
  const username = req.userName;
  try {
    const tasks = await Task.find({ createdBy: user });
    // console.log(user);
    // console.log(tasks);

    if (!tasks) {
      const response = {
        status: false,
        message: `Task not found`,
      };
      return res.status(200).send(response);
    }
    if (tasks.length === 0) {
      const response = {
        status: true,
        message: `No Task has been created by ${username}`,
      };
      return res.status(200).send(response);
    }

    const response = {
      status: true,
      totalTasks: tasks.length,
      message: `Tasks Fetch Successfully for user: ${username}`,
      data: { tasks },
    };
    res.status(200).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);

    const response = {
      status: false,
      message: `Bad Request`,
      errors: err,
    };
    res.status(err.statusCode).send(response);
  }
};

//--------------------------------------------------Get One Task--------------------------------------------------
const getTask = async (req, res) => {
  const taskId = req.params.taskId;
  const userIdFromToken = req.userId;
  const usernameFromToken = req.userName;

  // console.log(taskId, userIdFromToken);

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    const response = {
      status: false,
      currentUser: usernameFromToken,
      message: `Invalid ObjectId`,
    };

    return res.status(404).send(response);
  }

  try {
    const task = await Task.findById(taskId).populate("createdBy", "username");
    // console.log("taskuserid", taskUserId);

    if (!task) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `No task found with taskId: ${taskId}`,
      };

      return res.status(404).send(response);
    }

    const taskUserId = task.createdBy._id.toString();
    // Check if the userIdFromToken matches the task creator's userId
    if (task.visibility === "private") {
      // console.log(task.authorizedUsers.includes(task.createdBy.username));
      // console.log(taskUserId !== userIdFromToken);
      console.log(task.authorizedUsers);
      if (
        taskUserId !== userIdFromToken ||
        task.authorizedUsers.includes(task.createdBy.username)
      ) {
        const response = {
          status: false,
          currentUser: usernameFromToken,
          message: `Unauthorized: This Task was created by another User: ${task.createdBy.username}`,
        };

        return res.status(401).send(response);
      }
      const response = {
        status: true,
        message: `Task Fetch Successfully`,
        data: { task },
      };
      res.status(200).send(response);
    }

    if (task.visibility === "public_auth") {
      const response = {
        status: true,
        message: `Task Fetch Successfully`,
        data: { task },
      };
      res.status(200).send(response);
    }
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);

    const response = {
      status: false,
      message: `Bad Request`,
      errors: err,
    };
    res.status(err.statusCode).send(response);
  }
};

//--------------------------------------------------Create Task--------------------------------------------------

const createTask = async (req, res) => {
  const { title, description } = req.body;
  const userIdFromToken = req.userId;
  try {
    const task = await Task.create({
      title,
      description,
      createdBy: userIdFromToken,
    });

    const response = {
      status: true,
      message: `Task Created Successfully`,
      data: { task },
    };
    res.status(201).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);

    const response = {
      status: false,
      message: `Bad Request`,
      errors: err,
    };
    res.status(err.statusCode).send(response);
  }
};

//--------------------------------------------------Update Task--------------------------------------------------

const updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const updated = req.body;
  const userIdFromToken = req.userId;
  const usernameFromToken = req.userName;

  // console.log(taskId, userIdFromToken);

  try {
    const task = await Task.findById(taskId).populate("user", "username");
    if (!task) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `No task found with taskId: ${taskId}`,
      };

      return res.status(404).send(response);
    }
    const taskUserId = task.createdBy._id.toString();

    // Check if the userId matches the task creator's userId
    if (taskUserId !== userIdFromToken) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `You are not authorized to update this task. This Task was created by another User: ${task.createdBy.username}`,
      };

      return res.status(403).send(response);
    }
    const response = {
      status: true,
      currentUser: usernameFromToken,
      message: `Task Updated Successfully`,
      data: { task },
    };
    res.status(200).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);

    const response = {
      status: false,
      message: `Bad Request`,
      errors: err,
    };
    res.status(err.statusCode).send(response);
  }
};

//--------------------------------------------------Update Task Status--------------------------------------------------

const updateTaskStatus = async (req, res) => {
  res.status(200).send("Updated Successfully");
};

//--------------------------------------------------Delete Task--------------------------------------------------

const deleteTask = async (req, res) => {
  res.status(200).send("Deleted Successfully");
};

//--------------------------------------------------Authorize User--------------------------------------------------

const giveUserAccess = async (req, res) => {
  res.status(200).send("Successfully");
};
//--------------------------------------------------Revoke User Access--------------------------------------------------

const revokeUserAccess = async (req, res) => {
  res.status(200).send("Successfully");
};
//--------------------------------------------------Visibility (Broader audience)--------------------------------------------------

const visibilityStatus = async (req, res) => {
  res.status(200).send("Successfully");
};

export default {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  giveUserAccess,
  revokeUserAccess,
  visibilityStatus,
};
