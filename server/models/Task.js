import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    attachments: [{ type: String }], //File paths
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamp: true }
);

export default mongoose.model("Task", taskSchema);
