import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes, tasksRoutes, notesRoutes);
// app.use("/api/auth", tasksRoutes);

app.get("/", (req, res) => res.send("Hello App"));

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
