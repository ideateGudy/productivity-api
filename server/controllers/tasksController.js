import Task from "../models/Task.js";

// Task validation failed

const handleErrors = (err) => {
  console.log(err.message, err.code, "here-----------------");

  const errors = {};

  //Validation Errors
  if (err.message.includes("Task validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      console.log("properties---------", properties);
      // errors[properties.path] = properties.message;
      errors.statusCode = 400;
    });
  }

  return errors;
};

//Get All Tasks
const getAllTasks = async (req, res) => {
  res.status(200).send("Fetch Successfully");
};
//Get One Task
const getTask = async (req, res) => {
  res.status(200).send("Fetch Successfully");
};
//Create Task
const createTask = async (req, res) => {
  const newTask = req.body;
  try {
    const task = await Task.create(newTask);

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
//Update Task
const updateTask = async (req, res) => {
  res.status(200).send("Updated Successfully");
};
//Update Task Status
const updateTaskStatus = async (req, res) => {
  res.status(200).send("Updated Successfully");
};
//Delete Task
const deleteTask = async (req, res) => {
  res.status(200).send("Deleted Successfully");
};

export default {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
