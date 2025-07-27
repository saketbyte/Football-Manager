import express from "express";
import authController from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login or register a user
 *     description: Accepts user credentials. If the user exists, logs them in; otherwise registers and returns a JWT.
 *     tags:
 *       - auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login or registration
 *       400:
 *         description: Bad request (missing or invalid input)
 *       500:
 *         description: Server error
 */
router.post("/login", authController.loginOrRegister);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     description: Returns the authenticated user's profile data. Requires a valid JWT token.
 *     tags:
 *       - auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */
router.get("/profile", authenticateToken, authController.getProfile);

export default router;

// NOTES: Migration to Express JS V5 '?' not supported in v5
// v4
// app.get('/:file.:ext?', async (req, res) => {
//   res.send('ok')
// })
//
// // v5
// app.get('/:file{.:ext}', async (req, res) => {
//   res.send('ok')
// })
//
