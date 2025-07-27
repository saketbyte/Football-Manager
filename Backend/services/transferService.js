import { v4 as uuidv4 } from "uuid";
import { transfers, teams } from "../models/data.js";
import teamService from "./teamService.js";

// Using classes to maintain encapsulation and Singleton design pattern.

class TransferService {
	async getAvailableTransfers(filters = {}) {
		let availableTransfers = [];

		// Get all players on transfer list
		teams.forEach((team) => {
			team.players.forEach((player) => {
				if (player.onTransferList) {
					availableTransfers.push({
						id: uuidv4(),
						playerId: player.id,
						playerName: player.name,
						position: player.position,
						originalTeam: player.team,
						sellingTeamId: team.id,
						askingPrice: player.askingPrice,
						value: player.value,
					});
				}
			});
		});

		// Apply filter fro team name
		if (filters.teamName) {
			availableTransfers = availableTransfers.filter((transfer) => transfer.originalTeam.toLowerCase().includes(filters.teamName.toLowerCase()));
		}
		// player name
		if (filters.playerName) {
			availableTransfers = availableTransfers.filter((transfer) => transfer.playerName.toLowerCase().includes(filters.playerName.toLowerCase()));
		}
		// max and min price ranges...
		if (filters.maxPrice) {
			availableTransfers = availableTransfers.filter((transfer) => transfer.askingPrice <= filters.maxPrice);
		}

		if (filters.minPrice) {
			availableTransfers = availableTransfers.filter((transfer) => transfer.askingPrice >= filters.minPrice);
		}

		return availableTransfers;
	}

	async addPlayerToTransferList(userId, playerId, askingPrice) {
		const team = await teamService.getTeamByUserId(userId);
		if (!team) {
			throw new Error("Team not found");
		}

		const player = team.players.find((p) => p.id === playerId);
		if (!player) {
			throw new Error("Player not found in your team");
		}

		// Check if removing this player would violate team size constraints
		if (team.players.length <= 15) {
			throw new Error("Cannot sell player - team must have at least 15 players");
		}

		player.onTransferList = true;
		player.askingPrice = askingPrice;

		return player;
	}

	async removePlayerFromTransferList(userId, playerId) {
		const team = await teamService.getTeamByUserId(userId);
		if (!team) {
			throw new Error("Team not found");
		}

		const player = team.players.find((p) => p.id === playerId);
		if (!player) {
			throw new Error("Player not found in your team");
		}

		player.onTransferList = false;
		player.askingPrice = null;

		return player;
	}

	async buyPlayer(buyerUserId, playerId) {
		const buyerTeam = await teamService.getTeamByUserId(buyerUserId);
		if (!buyerTeam) {
			throw new Error("Buyer team not found");
		}

		// Find the player in transfer market
		let sellerTeam = null;
		let playerToBuy = null;

		for (const team of teams) {
			const player = team.players.find((p) => p.id === playerId && p.onTransferList);
			if (player) {
				sellerTeam = team;
				playerToBuy = player;
				break;
			}
		}

		if (!playerToBuy || !sellerTeam) {
			throw new Error("Player not found on transfer market");
		}

		// Check if buyer is trying to buy their own player
		if (sellerTeam.userId === buyerUserId) {
			throw new Error("Cannot buy your own player");
		}

		// Check team size constraints
		if (buyerTeam.players.length >= 25) {
			throw new Error("Cannot buy player - team cannot exceed 25 players");
		}

		// Calculate purchase price (95% of asking price)
		const purchasePrice = Math.floor(playerToBuy.askingPrice * 0.95);

		// Check if buyer has enough budget
		if (buyerTeam.budget < purchasePrice) {
			throw new Error("Insufficient budget");
		}

		// Execute transfer!
		// Remove player from seller team (borrwed frmo teamService.js)
		await teamService.removePlayerFromTeam(sellerTeam.id, playerId);

		// Add player to buyer team
		const playerForBuyer = {
			...playerToBuy,
			onTransferList: false,
			askingPrice: null,
		};
		await teamService.addPlayerToTeam(buyerTeam.id, playerForBuyer);

		// Update budgets
		await teamService.updateTeamBudget(buyerTeam.id, buyerTeam.budget - purchasePrice);
		await teamService.updateTeamBudget(sellerTeam.id, sellerTeam.budget + playerToBuy.askingPrice);

		// Record transfer
		const transfer = {
			id: uuidv4(),
			playerId: playerId,
			playerName: playerToBuy.name,
			sellerTeamId: sellerTeam.id,
			buyerTeamId: buyerTeam.id,
			askingPrice: playerToBuy.askingPrice,
			purchasePrice: purchasePrice,
			timestamp: new Date().toISOString(),
		};

		transfers.push(transfer);

		return transfer;
	}
	// getting transfer history.
	async getTransferHistory(userId) {
		const team = await teamService.getTeamByUserId(userId);
		if (!team) {
			return [];
		}

		return transfers.filter((transfer) => transfer.sellerTeamId === team.id || transfer.buyerTeamId === team.id);
	}
}

export default new TransferService();
