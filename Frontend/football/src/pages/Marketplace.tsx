import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import { PlayerCard } from "../components/Common/PlayerCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

// Making interface to keep the data consistency.
interface TransferPlayer {
	id: string;
	name: string;
	position: string;
	team: string;
	value: number;
	askingPrice: number;
	sellerTeamId: string;
}
// console.log(type TransferPlayer)
interface Filters {
	teamName: string;
	name: string;
	minPrice: string;
	maxPrice: string;
}

const Marketplace: React.FC = () => {
	const [transfers, setTransfers] = useState<TransferPlayer[]>([]);
	const [filteredTransfers, setFilteredTransfers] = useState<TransferPlayer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionLoading, setActionLoading] = useState<string | null>(null);
	const [filters, setFilters] = useState<Filters>({
		teamName: "",
		name: "",
		minPrice: "",
		maxPrice: "",
	});

	useEffect(() => {
		fetchTransfers();
		// console.log(transfers)
	}, []);

	useEffect(() => {
		applyFilters();
		// console.log(filters)
	}, [transfers, filters]);

	const fetchTransfers = async () => {
		try {
			setIsLoading(true);
			const response = await apiService.getTransferMarket();
			// console.log("fetch transfer...", response)

			setTransfers(response.transfers);
			setError("");
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = [...transfers];

		if (filters.name) {
			filtered = filtered.filter((player) => player.name.toLowerCase().includes(filters.name.toLowerCase()));
		}

		if (filters.teamName) {
			filtered = filtered.filter((player) => player.team.toLowerCase().includes(filters.teamName.toLowerCase()));
		}

		if (filters.minPrice) {
			const minPrice = parseFloat(filters.minPrice);
			if (!isNaN(minPrice)) {
				filtered = filtered.filter((player) => player.askingPrice >= minPrice);
			}
		}

		if (filters.maxPrice) {
			const maxPrice = parseFloat(filters.maxPrice);
			if (!isNaN(maxPrice)) {
				filtered = filtered.filter((player) => player.askingPrice <= maxPrice);
			}
		}

		setFilteredTransfers(filtered);
	};

	const handleFilterChange = (key: keyof Filters, value: string) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const clearFilters = () => {
		setFilters({
			teamName: "",
			name: "",
			minPrice: "",
			maxPrice: "",
		});
	};

	const handleBuyPlayer = async (playerId: string) => {
		try {
			setActionLoading(playerId);
			await apiService.buyPlayer(playerId);
			// console.log(`Attempting to buy player number - ${playerId} `);

			// Refresh the marketplace after successful purchase
			fetchTransfers();
			setError("");
		} catch (err) {
			setError(err.message);
		} finally {
			setActionLoading(null);
		}
	};
	// :( not used cause throwing some randome rror rnn will use later
	// const formatCurrency = (amount: number) => {
	// 	return new Intl.NumberFormat("en-US", {
	// 		style: "currency",
	// 		currency: "USD",
	// 		minimumFractionDigits: 0,
	// 	}).format(amount);
	// };

	const groupByPosition = (players: TransferPlayer[]) => {
		return {
			GK: players.filter((p) => p.position === "GK"),
			DEF: players.filter((p) => p.position === "DEF"),
			MID: players.filter((p) => p.position === "MID"),
			ATT: players.filter((p) => p.position === "ATT"),
		};
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	const groupedPlayers = groupByPosition(filteredTransfers);
	const hasActiveFilters = Object.values(filters).some((filter) => filter !== "");

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Transfer Market</h1>
				<div className='text-right'>
					<p className='text-sm text-gray-600'>Available Players</p>
					<p className='text-2xl font-bold text-blue-600'>{filteredTransfers.length}</p>
				</div>
			</div>

			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Filters card*/}
			<Card>
				<CardHeader>
					<CardTitle>Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<div>
							<label className='text-sm font-medium mb-2 block'>Player Name</label>
							<Input placeholder='Search by player name' value={filters.name} onChange={(e) => handleFilterChange("name", e.target.value)} />
						</div>
						<div>
							<label className='text-sm font-medium mb-2 block'>Team Name</label>
							<Input placeholder='Search by team name' value={filters.teamName} onChange={(e) => handleFilterChange("teamName", e.target.value)} />
						</div>
						<div>
							<label className='text-sm font-medium mb-2 block'>Min Price</label>
							<Input type='number' placeholder='Minimum price' value={filters.minPrice} onChange={(e) => handleFilterChange("minPrice", e.target.value)} />
						</div>
						<div>
							<label className='text-sm font-medium mb-2 block'>Max Price</label>
							<Input type='number' placeholder='Maximum price' value={filters.maxPrice} onChange={(e) => handleFilterChange("maxPrice", e.target.value)} />
						</div>
					</div>
					{hasActiveFilters && (
						<div className='mt-4'>
							<Button variant='outline' onClick={clearFilters}>
								Clear All Filters
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Results Summary */}
			<div className='flex items-center gap-4 text-sm text-gray-600'>
				<span>
					Showing {filteredTransfers.length} of {transfers.length} players
				</span>
				{hasActiveFilters && <Badge variant='secondary'>Filters Applied</Badge>}
			</div>

			{/* No Results */}
			{filteredTransfers.length === 0 && !isLoading && (
				<Card>
					<CardContent className='p-6 text-center text-gray-500'>{hasActiveFilters ? "No players match your current filters. Try adjusting your search criteria." : "No players available in the transfer market at the moment."}</CardContent>
				</Card>
			)}

			{/* Players by Position */}
			{Object.entries(groupedPlayers).map(([position, players]) => {
				if (players.length === 0) return null;

				return (
					<div key={position} className='space-y-4'>
						<div className='flex items-center gap-2'>
							<h2 className='text-xl font-semibold'>{position === "GK" ? "Goalkeepers" : position === "DEF" ? "Defenders" : position === "MID" ? "Midfielders" : "Attackers"}</h2>
							<Badge variant='secondary'>{players.length}</Badge>
						</div>
						{console.log(players)}
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
							{players.map((player) => (
								<PlayerCard key={player.id} player={player} showActions={true} actionType='buy' onAction={handleBuyPlayer} isActionLoading={actionLoading === player.id} />
							))}
						</div>
					</div>
				);
			})}

			{/* Refresh Button */}
			<div className='flex justify-center pt-4'>
				<Button variant='outline' onClick={fetchTransfers} disabled={isLoading}>
					{isLoading ? "Refreshing..." : "Refresh Market"}
				</Button>
			</div>
		</div>
	);
};

export default Marketplace;
