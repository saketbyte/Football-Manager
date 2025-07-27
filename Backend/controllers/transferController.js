import transferService from "../services/transferService.js";

class TransferController {
	async getTransferMarket(req, res) {
		try {
			// Adding filter which I will use for filtering in the ui marketplace.
			const filters = {
				teamName: req.query.teamName,
				playerName: req.query.playerName,
				minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
				maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
			};
			// function in transferService to fetch players in market place based on the filters processed above in controller.
			const transfers = await transferService.getAvailableTransfers(filters);

			res.json({
				success: true,
				transfers,
				count: transfers.length,
			});
		} catch (error) {
			console.error("Get transfer market error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async addPlayerToTransferList(req, res) {
		try {
			const { playerId, askingPrice } = req.body;

			if (!playerId || !askingPrice) {
				return res.status(400).json({ error: "Player ID and asking price are required" });
			}

			if (askingPrice <= 0) {
				return res.status(400).json({ error: "Asking price must be greater than 0" });
			}

			const player = await transferService.addPlayerToTransferList(req.user.id, playerId, parseFloat(askingPrice));

			res.json({
				success: true,
				message: "Player added to transfer list",
				player,
			});
		} catch (error) {
			console.error("Add to transfer list error:", error);
			res.status(400).json({ error: error.message });
		}
	}

	async removePlayerFromTransferList(req, res) {
		try {
			const { playerId } = req.params;

			if (!playerId) {
				return res.status(400).json({ error: "Player ID is required" });
			}

			const player = await transferService.removePlayerFromTransferList(req.user.id, playerId);

			res.json({
				success: true,
				message: "Player removed from transfer list",
				player,
			});
		} catch (error) {
			console.error("Remove from transfer list error:", error);
			res.status(400).json({ error: error.message });
		}
	}

	async buyPlayer(req, res) {
		try {
			const { playerId } = req.body;

			if (!playerId) {
				return res.status(400).json({ error: "Player ID is required" });
			}

			const transfer = await transferService.buyPlayer(req.user.id, playerId);

			res.json({
				success: true,
				message: "Player purchased successfully",
				transfer,
			});
		} catch (error) {
			console.error("Buy player error:", error);
			res.status(400).json({ error: error.message });
		}
	}

	async getTransferHistory(req, res) {
		try {
			const history = await transferService.getTransferHistory(req.user.id);

			res.json({
				success: true,
				history,
				count: history.length,
			});
		} catch (error) {
			console.error("Get transfer history error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}

export default new TransferController();
