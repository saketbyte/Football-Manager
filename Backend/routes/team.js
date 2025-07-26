import express from "express";
import teamController from "../controllers/teamController.js";

const router = express.Router();

router.get("/", teamController.getTeam);

router.get("/status", teamController.getTeamStatus);

router.get("/transfer-list", teamController.getPlayersOnTransferList);

export default router;
