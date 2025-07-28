import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/useAuth.ts";
import { apiService } from "../services/apiService";
import { PlayerCard } from "../components/Common/PlayerCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const Profile: React.FC = () => {
	const { user, hasTeam } = useAuth();
	const [team, setTeam] = useState<Team | null>(null);
	const [transferListPlayers, setTransferListPlayers] = useState<[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (hasTeam) {
			// checking if team exists
			fetchProfileData();
		} else {
			setIsLoading(false);
		}
	}, [hasTeam]);

	const fetchProfileData = async () => {
		try {
			setIsLoading(true);
			// hitting both APIs together
			const [teamResponse, transferListResponse] = await Promise.all([apiService.getTeam(), apiService.getPlayersOnTransferList()]);
			//
			// 			console.log("team data received:", teamResponse);
			// 			console.log("transfer list response:", transferListResponse);

			setTeam(teamResponse.team);
			setTransferListPlayers(transferListResponse.players);
			setError("");
		} catch (err) {
			console.log("error while fetching profile data", err);
			setError(err.message);
		} finally {
			setIsLoading(false);
			// loading done bro
		}
	};

	const formatCurrency = (amount: number) => {
		// format for USD only, later make it dynamic maybe
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const calculateTeamValue = (players: Team["players"]) => {
		// calculating total value of team
		return players.reduce((total, player) => total + player.value, 0);
	};

	if (isLoading) {
		// spinner till the spinner not TT So many bugs today
		return <LoadingSpinner />;
	}

	if (!hasTeam) {
		return (
			<div className='text-center'>
				<Alert>
					<AlertDescription>Your team is still being created. Please check back in a moment.</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (!team) {
		return (
			<div className='text-center'>
				<Alert variant='destructive'>
					<AlertDescription>Unable to load your profile data. Please try refreshing the page.</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Profile</h1>
			</div>

			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* User Info */}
				<Card>
					<CardHeader>
						<CardTitle>User Information</CardTitle>
					</CardHeader>
					<CardContent className='space-y-3'>
						<div>
							<p className='text-sm text-gray-600'>Email</p>
							<p className='font-medium'>{user?.email}</p>
						</div>
						<div>
							<p className='text-sm text-gray-600'>User ID</p>
							<p className='font-medium font-mono text-xs'>{user?.id}</p>
						</div>
					</CardContent>
				</Card>

				{/* Team Stats */}
				<Card>
					<CardHeader>
						<CardTitle>Team Statistics</CardTitle>
					</CardHeader>
					<CardContent className='space-y-3'>
						<div>
							<p className='text-sm text-gray-600'>Total Players</p>
							<p className='font-medium'>{team.totalPlayers}</p>
						</div>
						<div>
							<p className='text-sm text-gray-600'>Available Budget</p>
							<p className='font-medium text-green-600'>{formatCurrency(team.budget)}</p>
						</div>
						<div>
							<p className='text-sm text-gray-600'>Team Value</p>
							<p className='font-medium'>{formatCurrency(calculateTeamValue(team.players))}</p>
						</div>
						<div>
							<p className='text-sm text-gray-600'>Players on Transfer List</p>
							<p className='font-medium'>{transferListPlayers.length}</p>
						</div>
					</CardContent>
				</Card>

				{/* Team Composition */}
				<Card>
					<CardHeader>
						<CardTitle>Team Composition</CardTitle>
					</CardHeader>
					<CardContent className='space-y-3'>
						{Object.entries(team.composition).map(([position, count]) => (
							<div key={position} className='flex justify-between items-center'>
								<span className='text-sm'>{position === "GK" ? "Goalkeepers" : position === "DEF" ? "Defenders" : position === "MID" ? "Midfielders" : "Attackers"}</span>
								<Badge variant='secondary'>{count}</Badge>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Players Section */}
			<Tabs defaultValue='all' className='space-y-4'>
				<TabsList>
					<TabsTrigger value='all'>All Players ({team.totalPlayers})</TabsTrigger>
					<TabsTrigger value='transfer'>On Transfer List ({transferListPlayers.length})</TabsTrigger>
				</TabsList>

				<TabsContent value='all' className='space-y-4'>
					<h2 className='text-xl font-semibold'>All Team Players</h2>
					{/* check all team players here */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
						{team.players.map((player) => (
							<PlayerCard key={player.id} player={player} showActions={false} />
						))}
					</div>
				</TabsContent>

				<TabsContent value='transfer' className='space-y-4'>
					<h2 className='text-xl font-semibold'>Players on Transfer List</h2>
					{/* transfer list visible below */}
					{transferListPlayers.length === 0 ? (
						<Card>
							<CardContent className='p-6 text-center text-gray-500'>No players currently on transfer list</CardContent>
						</Card>
					) : (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
							{transferListPlayers.map((player) => (
								<PlayerCard key={player.id} player={player} showActions={false} />
							))}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Profile;
