import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth.ts";
import { apiService } from "../services/apiService";
import { PlayerCard } from "../components/Common/PlayerCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface Team {
	id: string;
	budget: number;
	players: Array<{
		id: string;
		name: string;
		position: string;
		team: string;
		value: number;
		onTransferList: boolean;
		askingPrice?: number;
	}>;
	composition: {
		GK: number;
		DEF: number;
		MID: number;
		ATT: number;
	};
	totalPlayers: number;
}

const Dashboard: React.FC = () => {
	// all state definitions and auth.
	const { hasTeam, teamCreationInProgress, refreshProfile } = useAuth();
	const [team, setTeam] = useState<Team | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [actionLoading, setActionLoading] = useState<string | null>(null);

	useEffect(() => {
		fetchTeam();
		// Hold and refresh for team status if creation is in progress
		if (teamCreationInProgress) {
			const interval = setInterval(() => {
				refreshProfile();
				fetchTeam();
			}, 3000);
			return () => clearInterval(interval);
		}
	}, [teamCreationInProgress]);

	const fetchTeam = async () => {
		try {
			setIsLoading(true);
			const response = await apiService.getTeam();
			// console.log("Checking fetchTeam responseeee.: ",response);
			setTeam(response.team);
			setError("");
		} catch (err) {
			if (err.message.includes("Team not found")) {
				setTeam(null);
				// console.log("Checking fetchTeam responseeee.: ",err);
			} else {
				setError(err.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleSellPlayer = async (playerId: string, price: number) => {
		try {
			setActionLoading(playerId);
			await apiService.addPlayerToTransferList(playerId, price);
			fetchTeam(); // Refresh team data
			// console.log("Checking new player case.");
		} catch (err) {
			setError(err.message);
		} finally {
			setActionLoading(null);
		}
	};

	const handleRemoveFromTransferList = async (playerId: string) => {
		try {
			setActionLoading(playerId);
			await apiService.removePlayerFromTransferList(playerId);
			fetchTeam();
			// console.log("Removed player fetchTeam responseeee.: ",response);
		} catch (err) {
			setError(err.message);
		} finally {
			setActionLoading(null);
		}
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (teamCreationInProgress || !hasTeam) {
		return (
			<div className='flex items-center justify-center min-h-[50vh]'>
				<Card className='w-full max-w-md'>
					<CardHeader className='text-center'>
						<CardTitle>Creating Your Team</CardTitle>
						<CardDescription>Please wait while we generate your fantasy football team...</CardDescription>
					</CardHeader>
					<CardContent className='flex justify-center'>
						<LoadingSpinner />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!team) {
		// console.log("HERE");
		return (
			<div className='text-center'>
				<Alert>
					<AlertDescription>Unable to load your team. Please try refreshing the page.</AlertDescription>
				</Alert>
			</div>
		);
	}

	const groupPlayersByPosition = (players: Team["players"]) => {
		return {
			GK: players.filter((p) => p.position === "GK"),
			DEF: players.filter((p) => p.position === "DEF"),
			MID: players.filter((p) => p.position === "MID"),
			ATT: players.filter((p) => p.position === "ATT"),
		};
	};

	const groupedPlayers = groupPlayersByPosition(team.players);

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>My Team</h1>
				<div className='text-right'>
					<p className='text-sm text-gray-600'>Available Budget</p>
					<p className='text-2xl font-bold text-green-600'>{formatCurrency(team.budget)}</p>
				</div>
			</div>

			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Team Stats */}
			<div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
				<Card>
					<CardContent className='p-4 text-center'>
						<p className='text-2xl font-bold'>{team.totalPlayers}</p>
						<p className='text-sm text-gray-600'>Total Players</p>
					</CardContent>
				</Card>
				{Object.entries(team.composition).map(([position, count]) => (
					<Card key={position}>
						<CardContent className='p-4 text-center'>
							<p className='text-2xl font-bold'>{count}</p>
							<p className='text-sm text-gray-600'>{position}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Players by Position */}
			{Object.entries(groupedPlayers).map(([position, players]) => (
				<div key={position} className='space-y-4'>
					<div className='flex items-center gap-2'>
						<h2 className='text-xl font-semibold'>{position === "GK" ? "Goalkeepers" : position === "DEF" ? "Defenders" : position === "MID" ? "Midfielders" : "Attackers"}</h2>
						<Badge variant='secondary'>{players.length}</Badge>
					</div>
					{console.log(players)}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
						{players.map((player) => (
							<PlayerCard
								key={player.id}
								player={player}
								showActions={true}
								actionType={player.onTransferList ? "remove" : "sell"}
								onAction={player.onTransferList ? handleRemoveFromTransferList : handleSellPlayer}
								isActionLoading={actionLoading === player.id}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default Dashboard;
