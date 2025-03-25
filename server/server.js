import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import authMiddleware from "./middlewares/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/v1/api/auth", authRoutes, authMiddleware, tasksRoutes, notesRoutes);
// app.use("/api/auth", tasksRoutes);

app.get("/", (_req, res) => res.send("Hello App"));

app.listen(PORT, () =>
  console.log(`✅ Server is running on http://localhost:${PORT}`)
);
