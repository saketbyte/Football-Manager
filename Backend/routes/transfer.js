import express from "express";
import transferController from "../controllers/transferController.js";

const router = express.Router();

/**
 * @swagger
 * /api/transfer/market:
 *   get:
 *     summary: Get transfer market
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - transfer
 *     description: Retrieves a list of available players for transfer, optionally filtered by criteria like position, price, etc.
 *     parameters:
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter players by position
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Filter players by maximum price
 *     responses:
 *       200:
 *         description: Transfer market data successfully retrieved
 *       500:
 *         description: Server error
 */
router.get("/market", transferController.getTransferMarket);

/**
 * @swagger
 * /api/transfer/list:
 *   post:
 *     summary: Add a player to transfer list
 *     description: Adds a player to the user's transfer list for potential sale.
 *     tags:
 *       - transfer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerId
 *               - askingPrice
 *             properties:
 *               playerId:
 *                 type: string
 *                 description: ID of the player to add to the transfer list
 *     responses:
 *       200:
 *         description: Player successfully listed for transfer
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post("/list", transferController.addPlayerToTransferList);

/**
 * @swagger
 * /api/transfer/list/{playerId}:
 *   delete:
 *     summary: Remove a player from transfer list
 *     description: Deletes a player from the user's transfer list.
 *     tags:
 *       - transfer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the player to remove
 *     responses:
 *       200:
 *         description: Player successfully removed from transfer list
 *       404:
 *         description: Player not found
 *       500:
 *         description: Server error
 */
router.delete("/list/:playerId", transferController.removePlayerFromTransferList);

/**
 * @swagger
 * /api/transfer/buy:
 *   post:
 *     summary: Buy a player
 *     description: Completes the purchase of a player from the transfer market.
 *     tags:
 *       - transfer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerId
 *             properties:
 *               playerId:
 *                 type: string
 *                 description: ID of the player to buy
 *     responses:
 *       200:
 *         description: Player purchase successful
 *       400:
 *         description: Invalid purchase request
 *       500:
 *         description: Server error
 */
router.post("/buy", transferController.buyPlayer);

/**
 * @swagger
 * /api/transfer/history:
 *   get:
 *     summary: Get transfer history
 *     description: Returns a list of past transfer transactions for the authenticated user.
 *     tags:
 *       - transfer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transfer history successfully retrieved
 *       500:
 *         description: Server error
 */
router.get("/history", transferController.getTransferHistory);

export default router;
