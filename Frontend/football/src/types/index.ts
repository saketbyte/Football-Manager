export interface User {
	id: string;
	email: string;
}

export interface Player {
	id: string;
	name: string;
	position: "GK" | "DEF" | "MID" | "ATT";
	team: string;
	value: number;
	onTransferList?: boolean;
	askingPrice?: number;
	originalId?: string;
}

export interface Team {
	id: string;
	userId: string;
	budget: number;
	players: Player[];
	composition: {
		GK: number;
		DEF: number;
		MID: number;
		ATT: number;
	};
	totalPlayers: number;
	createdAt: string;
}

export interface Transfer {
	id: string;
	playerId: string;
	name: string;
	sellerTeamId: string;
	buyerTeamId: string;
	askingPrice: number;
	purchasePrice: number;
	timestamp: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}
