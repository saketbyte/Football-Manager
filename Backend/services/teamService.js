import { v4 as uuidv4 } from "uuid";
import { teams, playerPool } from "../models/data.js";

class TeamService {
	async createTeam(userId) {
		// Simulate async team creation process
		return new Promise((resolve) => {
			setTimeout(() => {
				const selectedPlayers = this.selectRandomPlayers();
				const team = {
					id: uuidv4(),
					userId,
					budget: 5000000,
					players: selectedPlayers,
					createdAt: new Date().toISOString()
				};

				teams.push(team);
				resolve(team);
			}, 2000); // 2 second delay to simulate processing
		});
	}

	selectRandomPlayers() {
		const goalkeepers = playerPool.filter((p) => p.position === "GK");
		const defenders = playerPool.filter((p) => p.position === "DEF");
		const midfielders = playerPool.filter((p) => p.position === "MID");
		const attackers = playerPool.filter((p) => p.position === "ATT");

		const selectedPlayers = [...this.getRandomPlayers(goalkeepers, 3), ...this.getRandomPlayers(defenders, 6), ...this.getRandomPlayers(midfielders, 6), ...this.getRandomPlayers(attackers, 5)];

		return selectedPlayers.map((player) => ({
			...player,
			id: uuidv4(), // Give each player instance a unique ID
			originalId: player.id,
			onTransferList: false,
			askingPrice: null
		}));
	}

	getRandomPlayers(players, count) {
		const shuffled = [...players].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, count);
	}

	async getTeamByUserId(userId) {
		return teams.find((team) => team.userId === userId);
	}

	async addPlayerToTeam(teamId, player) {
		const team = teams.find((t) => t.id === teamId);
		if (team) {
			team.players.push({
				...player,
				id: uuidv4(),
				originalId: player.originalId || player.id,
				onTransferList: false,
				askingPrice: null
			});
			return team;
		}
		return null;
	}

	async removePlayerFromTeam(teamId, playerId) {
		const team = teams.find((t) => t.id === teamId);
		if (team) {
			team.players = team.players.filter((p) => p.id !== playerId);
			return team;
		}
		return null;
	}

	async updateTeamBudget(teamId, newBudget) {
		const team = teams.find((t) => t.id === teamId);
		if (team) {
			team.budget = newBudget;
			return team;
		}
		return null;
	}

	validateTeamSize(team) {
		return team.players.length >= 15 && team.players.length <= 25;
	}

	getTeamComposition(team) {
		const composition = {
			GK: team.players.filter((p) => p.position === "GK").length,
			DEF: team.players.filter((p) => p.position === "DEF").length,
			MID: team.players.filter((p) => p.position === "MID").length,
			ATT: team.players.filter((p) => p.position === "ATT").length
		};
		return composition;
	}
}

export default new TeamService();
