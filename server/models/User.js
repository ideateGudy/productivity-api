import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter a username"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores (_), and hyphens (-)",
      ],
    },
    email: {
      type: String,
      required: [true, "Please Enter an Email"],
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter A Password"],
      minlength: [6, "Minimum Password length is 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user", // Default role is "user"
    },
  },
  { timestamps: true }
);

//This function is fired before document is saved in the database

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//This is a static method o login user

userSchema.statics.login = async function (identifier, password) {
  const user = await this.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  // console.log("this is me", user, identifier);
  if (!user) {
    throw new Error("Invalid Credentials");
  }

  if (user) {
    const confirmPassword = await bcrypt.compare(password, user.password);

    if (confirmPassword) {
      return user;
    }
    throw new Error("Incorrect Password");
  }

  if (identifier.includes("@")) {
    throw new Error("Incorrect Email");
  } else {
    throw new Error("Incorrect Username");
  }
};

export default mongoose.model("User", userSchema);
