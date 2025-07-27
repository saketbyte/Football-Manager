import express from "express";
import teamController from "../controllers/teamController.js";

const router = express.Router();

/**
 * @swagger
 * /api/team:
 *   get:
 *     summary: Retrieve user's team
 *     description: Fetches the team data associated with the authenticated user.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team data successfully retrieved
 *       401:
 *         description: Unauthorized - user not authenticated
 *       500:
 *         description: Server error
 */
router.get("/", teamController.getTeam);

/**
 * @swagger
 * /api/team/status:
 *   get:
 *     summary: Check team creation status
 *     description: Returns the current status of the user's team creation process.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved team creation status
 *       404:
 *         description: Team not found or not yet created
 *       500:
 *         description: Server error
 */
router.get("/status", teamController.getTeamStatus);

/**
 * @swagger
 * /api/team/transfer-list:
 *   get:
 *     summary: Get players on the transfer list
 *     description: Retrieves a list of players available for transfer in the user's team.
 *     tags:
 *       - team
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved transfer list
 *       404:
 *         description: No players on transfer list found
 *       500:
 *         description: Server error
 */
router.get("/transfer-list", teamController.getPlayersOnTransferList);

export default router;
