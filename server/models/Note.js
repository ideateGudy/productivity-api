import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checklist: [
      {
        text: { type: String, required: true }, // The text of the checklist item
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"], // Allowed values
          default: "pending", // Default status is "pending"
        },
      },
    ],
  },
  { timestamp: true }
);

noteSchema.index({ taskId: 1 }, { unique: true });

export default mongoose.model("Note", noteSchema);
