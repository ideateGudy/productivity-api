import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";
const { registerUser, loginUser, getAllUsers, logoutUser } = authController;
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout/:id", authMiddleware, logoutUser);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

export default router;
