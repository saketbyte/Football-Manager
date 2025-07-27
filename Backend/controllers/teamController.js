import teamService from "../services/teamService.js";

class TeamController {
	async getTeam(req, res) {
		try {
			const team = await teamService.getTeamByUserId(req.user.id);

			if (!team) {
				return res.status(404).json({
					error: "Team not found",
					teamCreationInProgress: true
				});
			}

			// Get team composition
			const composition = teamService.getTeamComposition(team);

			res.json({
				success: true,
				team: {
					id: team.id,
					budget: team.budget,
					players: team.players,
					composition,
					totalPlayers: team.players.length,
					createdAt: team.createdAt
				}
			});
		} catch (error) {
			console.error("Get team error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getTeamStatus(req, res) {
		try {
			const team = await teamService.getTeamByUserId(req.user.id);

			res.json({
				hasTeam: !!team,
				teamCreationInProgress: !team
			});
		} catch (error) {
			console.error("Team status error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getPlayersOnTransferList(req, res) {
		try {
			const team = await teamService.getTeamByUserId(req.user.id);

			if (!team) {
				return res.status(404).json({ error: "Team not found" });
			}
			console.log("getPlayersOnTransferList function in teamController", team);
			const playersOnTransferList = team.players.filter((player) => player.onTransferList);

			res.json({
				success: true,
				players: playersOnTransferList
			});
		} catch (error) {
			console.error("Get transfer list error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}

export default new TeamController();
