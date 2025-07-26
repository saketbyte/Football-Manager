import express from "express";
import authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", authController.loginOrRegister);

router.get("/profile", authenticateToken, authController.getProfile);

export default router;
