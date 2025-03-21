import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const handleErrors = (err) => {
  console.log(err.message, err.code, "here-----------------");

  const errors = {};

  if (err.message === "You are not authorized to view this page") {
    errors.message = "You are not authorized to view this page";
    errors.statusCode = 401;
  }

  //Check if email is correct(Login)
  if (err.message === "Incorrect Email") {
    errors.email = "Email is Incorrect";
    errors.statusCode = 401;
  }

  //Check if username is correct(Login)
  if (err.message === "Incorrect Username") {
    errors.username = "Username is Incorrect";
    errors.statusCode = 401;
  }

  //if user is not found
  if (err.message === "Invalid Credentials") {
    errors.invalid = "User Not Found";
    errors.statusCode = 404;
  }

  //Check if password is correct(Login)
  if (err.message === "Incorrect Password") {
    errors.password = "Password is Incorrect";
    errors.statusCode = 401;
  }

  //Check if user exists
  if (err.code === 11000 && err.message.includes("username")) {
    errors.username = "Username Already Exists";
    errors.statusCode = 409;
  }
  //Check if email exists
  if (err.code === 11000 && err.message.includes("email")) {
    errors.email = "Email Already Exists";
    errors.statusCode = 409;
  }

  //Validation Errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log("properties---------", properties);
      errors[properties.path] = properties.message;
      errors.statusCode = 400;
    });
  }

  return errors;
};

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (user) => {
  // console.log("here:-----", user);
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });

    const token = createToken(user);
    const response = {
      status: true,
      message: `User Created Successfully`,
      data: { user, token },
    };

    res.cookie("jwt", token, {
      httpOnly: true, // 🔹 Prevents XSS attacks
      // secure: true, // 🔹 Use HTTPS in production
      // sameSite: "Strict", // 🔹 Prevent CSRF attacks
      maxAge: 30 * 60 * 1000, // 🔹 10 minutes (Same as JWT "10m")
    });

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

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.login(username || email, password);
    // console.log(user);

    if (user) {
      const token = createToken(user);
      const response = {
        status: true,
        message: `User Login Successfully`,
        data: { user, token },
      };

      res.cookie("jwt", token, {
        httpOnly: true, // 🔹 Prevents XSS attacks
        // secure: true, // 🔹 Use HTTPS in production
        // sameSite: "Strict", // 🔹 Prevent CSRF attacks
        maxAge: 30 * 60 * 1000, // 🔹 30 minutes (Same as JWT "30m")
      });

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

const logoutUser = async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const response = {
      status: false,
      message: `Invalid ObjectID`,
    };
    return res.status(400).send(response);
  }

  try {
    const user = await User.findById(userId);

    if (user) {
      const response = {
        status: true,
        message: `User Logout Successfull`,
      };
      res.cookie("jwt", "", { maxAge: 1 });
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

//-------------------------------------

const getAllUsers = async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const response = {
      status: false,
      message: `Invalid ObjectID`,
    };
    return res.status(400).send(response);
  }

  try {
    const users = await User.find();

    if (!users) {
      const response = {
        status: false,
        message: `No User Found`,
      };

      return res.status(404).send(response);
    }

    const response = {
      status: true,
      totalUsers: await User.countDocuments(),
      message: `Users Fetch Successfull`,
      data: { users },
    };

    res.status(200).send(response);
  } catch (error) {
    const err = handleErrors(error);
    // console.error("1--------", error);
    const response = {
      status: false,
      message: `Bad Request`,
      errors: err,
    };
    res.status(err.statusCode).send(response);
  }
};

export default { registerUser, loginUser, getAllUsers, logoutUser };
