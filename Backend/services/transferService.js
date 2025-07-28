import { v4 as uuidv4 } from "uuid";
import { transfers, teams } from "../models/data.js";
import teamService from "./teamService.js";

// Using classes to maintain encapsulation and Singleton design pattern.

class TransferService {
	async getAvailableTransfers(filters = {}) {
		let availableTransfers = [];

		// Get all players on transfer list
		teams.forEach((team) => {
			console.log("For each team", team.id);

			team.players.forEach((player) => {
				if (player.onTransferList) {
					console.log("creating available transfer list");
					availableTransfers.push({
						id: player.id,
						playerId: player.id,
						name: player.name,
						position: player.position,
						team: player.team,
						sellingTeamId: team.id,
						askingPrice: player.askingPrice,
						value: player.value,
					});
				}
			});
		});
		console.log(availableTransfers);

		// Apply filter fro team name
		if (filters.teamName) {
			availableTransfers = availableTransfers.filter((transfer) => transfer.team.toLowerCase().includes(filters.teamName.toLowerCase()));
		}
		// player name
		if (filters.name) {
			availableTransfers = availableTransfers.filter((transfer) => transfer.name.toLowerCase().includes(filters.name.toLowerCase()));
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
		console.log("buyer user id: ", buyerUserId);
		const buyerTeam = await teamService.getTeamByUserId(buyerUserId);
		if (!buyerTeam) {
			throw new Error("Buyer team not found");
		}
		console.log("BUY PLAYER FUNCTION");
		console.log(buyerUserId);
		console.log(playerId);

		// Find the player in transfer market
		let sellerTeam = null;
		let playerToBuy = null;

		console.log("Available Teams: ", teams);
		for (const team of teams) {
			console.log("-----Team-----");
			console.log(`🆔 Team ID: ${team.id}`);
			console.log(`👤 User ID: ${team.userId}`);
			console.log(`💰 Budget: ₹${team.budget.toLocaleString()}`);
			console.log(`📅 Created At: ${team.createdAt}`);
			console.log("🧑‍🤝‍🧑 Players:");

			team.players.forEach((player, index) => {
				console.log(`  🎯 Player ${index + 1}:`);
				console.log(`    🆔 ID: ${player.id}`);
				console.log(`    🏷️ Original ID: ${player.originalId}`);
				console.log(`    🔄 On Transfer List: ${player.onTransferList}`);
				console.log(`    💸 Asking Price: ${player.askingPrice}`);
				console.log(`    📦 Full Player Object:`, player);
			});

			const player = team.players.find((p) => p.id === playerId && p.onTransferList);

			if (player) {
				console.log("Team: ", team);
				console.log("Player:", player);
				sellerTeam = team;
				playerToBuy = player;
				break;
			}
		}

		if (!playerToBuy || !sellerTeam) {
			console.log("buy player of transfer service");
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
			name: playerToBuy.name,
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
