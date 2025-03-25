import Task from "../models/Task.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const handleErrors = (err) => {
  console.log(err.message, err.code, "here-----------------");

  const errors = {};

  //Check if title was added
  // if (err.message === "title is not defined") {
  //   errors.message = "title is not defined";
  //   errors.code = 400;
  // }

  // Validation Errors
  if (err.message.includes("Task validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log("properties---------", properties);

      errors[properties.path] = properties.message;
      errors.error = properties.path;
      errors.code = 400;
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

    if (tasks.length === 0) {
      const response = {
        status: true,
        message: `No Task has been created by ${username}`,
      };
      return res.status(200).send(response);
    }

    if (!tasks) {
      const response = {
        status: false,
        message: `Task not found`,
      };
      return res.status(404).send(response);
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

    if (err) {
      const response = {
        status: false,
        message: `Bad Request`,
        errors: err,
      };
      return res.status(err.code).send(response);
    }
    res.status(500).json({ status: false, message: "Internal Server Error" });
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
      code: 404,
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
        code: 404,
      };

      return res.status(404).send(response);
    }

    const taskUserId = task.createdBy._id.toString();
    // Check if the userIdFromToken matches the task creator's userId -- if the user is "registered" and in the Authorized users array
    if (task.visibility === "private") {
      if (
        taskUserId !== userIdFromToken &&
        !task.authorizedUsers.includes(usernameFromToken)
      ) {
        const response = {
          status: false,
          currentUser: usernameFromToken,
          message: `Access Denied: This Task was created by another User`,
          creator: task.createdBy.username,
          code: 403,
        };

        return res.status(403).send(response);
      }
      const response = {
        status: true,
        message: `Task Fetch Successfully`,
        data: { task },
      };
      return res.status(200).send(response);
    }

    // Check if the user is registered in the database
    if (task.visibility === "public_auth") {
      const users = await User.find({}, "username"); // Fetch only the username field
      const allUsers = users.map((user) => user.username); // Convert to an array of usernames

      if (allUsers.includes(usernameFromToken)) {
        const response = {
          status: true,
          message: `Task Fetch Successfully`,
          data: { task },
        };
        return res.status(200).send(response);
      }
    }

    const response = {
      status: false,
      message: `Login to view this page`,
    };
    res.status(401).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);

    const response = {
      status: false,
      message: err.message,
      errors: err,
    };
    res.status(err.code).send(response);
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
    console.error("Error Registration: ", error);

    const response = {
      status: false,
      message: `Bad Request`,
      errors: err,
    };
    res.status(err.code).send(response);
  }
};

//--------------------------------------------------Update Task--------------------------------------------------

const updateTask = async (req, res) => {
  const taskId = req.params.taskId;
  const { title, description, status, attachments } = req.body;
  const userIdFromToken = req.userId;
  const usernameFromToken = req.userName;

  // console.log(taskId, userIdFromToken);

  try {
    const task = await Task.findById(taskId).populate("createdBy", "username");
    if (!task) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `No task found with taskId: ${taskId}`,
      };

      return res.status(404).send(response);
    }
    const taskUserId = task.createdBy._id.toString();

    // Check if the authenticated userId matches the task creator's userId
    if (taskUserId !== userIdFromToken) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `Access Denied: This Task was created by another User`,
        creator: task.createdBy.username,
      };

      return res.status(403).send(response);
    }

    Object.assign(task, { title, description, status, attachments });
    await task.save();
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
    res.status(err.code).send(response);
  }
};

//--------------------------------------------------Update Task Status--------------------------------------------------

const updateTaskStatus = async (req, res) => {
  const taskId = req.params.taskId;
  const { status } = req.body;
  const userIdFromToken = req.userId;
  const usernameFromToken = req.userName;

  // console.log(taskId, userIdFromToken);

  try {
    const task = await Task.findById(taskId).populate("createdBy", "username");
    if (!task) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `No task found with taskId: ${taskId}`,
      };

      return res.status(404).send(response);
    }
    const taskUserId = task.createdBy._id.toString();

    // Check if the authenticated userId matches the task creator's userId
    if (taskUserId !== userIdFromToken) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `You are not authorized to update this task status.`,
        creator: task.createdBy.username,
      };

      return res.status(403).send(response);
    }

    Object.assign(task, { status });
    await task.save();
    const response = {
      status: true,
      currentUser: usernameFromToken,
      message: `Task Status Updated Successfully`,
      data: { taskStatus: task.status },
    };
    res.status(200).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);
    // console.log(err === null);

    if (err) {
      const response = {
        status: false,
        message: `Bad Request`,
        errors: err,
      };
      return res.status(err.code).send(response);
    }
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//--------------------------------------------------Delete Task--------------------------------------------------

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const usernameFromToken = req.userName;
  const userIdFromToken = req.userId;

  try {
    const task = await Task.findById(taskId);
    const taskUserId = task.createdBy._id.toString();

    // Check if the authenticated userId matches the task creator's userId
    if (taskUserId !== userIdFromToken) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `You are not authorized to delete this task.`,
        creator: task.createdBy.username,
        code: 403,
      };
      return res.status(403).send(response);
    }
    await Task.findByIdAndDelete(taskId);

    const response = {
      status: true,
      currentUser: usernameFromToken,
      message: "Deleted Successfully",
    };
    res.status(200).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);
    // console.log(err === null);

    if (err) {
      const response = {
        status: false,
        message: `Bad Request`,
        errors: err,
      };
      return res.status(err.code).send(response);
    }
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//--------------------------------------------------Authorize User--------------------------------------------------

const giveUserAccess = async (req, res) => {
  const { taskId } = req.params;
  const { user } = req.body;
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
    const users = await User.find({}, "username"); // Fetch only the username field
    const allUsers = users.map((user) => user.username); // Convert to an array of usernames

    // console.log("taskuserid", taskUserId);

    if (!task) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `No task found with taskId: ${taskId}`,
      };

      return res.status(404).send(response);
    }
    // console.log(task);

    // Only the owner can grant permission
    // console.log(task.createdBy._id.toString(), userIdFromToken);
    if (task.createdBy._id.toString() !== userIdFromToken) {
      return res.status(403).json({
        status: false,
        currentUser: usernameFromToken,
        message: "You are not authorized to modify this task",
      });
    }
    // console.log(user);
    // console.log(allUsers);

    // Add user to authorizedUsers if not already present
    if (!task.authorizedUsers.includes(user) && allUsers.includes(user)) {
      task.authorizedUsers.push(user);
      await task.save();
    } else if (!allUsers.includes(user)) {
      const response = {
        status: false,
        message: `User not in database`,
      };
      return res.status(400).send(response);
    } else {
      const response = {
        status: false,
        message: `User ${user} already added to authorized users`,
      };
      return res.status(409).send(response);
    }

    const response = {
      status: true,
      message: `User \"${user}\" has been added to authorized users who can view this task`,
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
    res.status(err.code).send(response);
  }
};
//--------------------------------------------------Revoke User Access--------------------------------------------------

const revokeUserAccess = async (req, res) => {
  const { taskId } = req.params;
  const { user } = req.body;
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
    // const users = await User.find({}, "username"); // Fetch only the username field
    // const allUsers = users.map((user) => user.username); // Convert to an array of usernames

    // console.log("taskuserid", taskUserId);

    if (!task) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `No task found with taskId: ${taskId}`,
      };

      return res.status(404).send(response);
    }
    // console.log(task);

    // Only the owner can grant permission
    console.log(task.createdBy._id.toString(), userIdFromToken);
    if (task.createdBy._id.toString() !== userIdFromToken) {
      return res.status(403).json({
        status: false,
        currentUser: usernameFromToken,
        message: "You are not authorized to modify this task",
      });
    }
    // console.log(user);

    // Remove user from authorizedUsers if not already removed
    if (task.authorizedUsers.includes(user)) {
      const userIndex = task.authorizedUsers.indexOf(user);
      task.authorizedUsers.splice(userIndex, 1);
      await task.save();
    } else {
      const response = {
        status: false,
        message: `User not found`,
      };
      return res.status(404).send(response);
    }

    const response = {
      status: true,
      message: `User:  ${user}  has been removed from authorized users who can view this task`,
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
    res.status(err.code).send(response);
  }
};
//--------------------------------------------------Visibility (Broader audience)--------------------------------------------------

const visibilityStatus = async (req, res) => {
  const taskId = req.params.taskId;
  const { visibility } = req.body;
  const userIdFromToken = req.userId;
  const usernameFromToken = req.userName;

  // console.log(taskId, userIdFromToken);

  try {
    const task = await Task.findById(taskId).populate("createdBy", "username");
    if (!task) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `No task found with taskId: ${taskId}`,
      };

      return res.status(404).send(response);
    }
    const taskUserId = task.createdBy._id.toString();

    // Check if the authenticated userId matches the task creator's userId
    if (taskUserId !== userIdFromToken) {
      const response = {
        status: false,
        currentUser: usernameFromToken,
        message: `You are not authorized to update this task Visibility status.`,
      };

      return res.status(403).send(response);
    }

    Object.assign(task, { visibility });
    await task.save();
    const response = {
      status: true,
      currentUser: usernameFromToken,
      message: `Task Visibilty Status Updated Successfully`,
      data: { visibility: task.visibility },
    };
    res.status(200).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("Error Registration: ", error);
    // console.log(err === null);

    if (err) {
      const response = {
        status: false,
        message: `Bad Request`,
        errors: err,
      };
      return res.status(err.code).send(response);
    }
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

export {
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
