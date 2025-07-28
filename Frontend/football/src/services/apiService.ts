const API_BASE_URL = "http://localhost:3001/api";

class ApiService {
	private token: string | null = null;

	setToken(token: string | null) {
		this.token = token;
	}

	private async request(endpoint: string, options: RequestInit = {}) {
		const url = `${API_BASE_URL}${endpoint}`;
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...options.headers,
		};

		if (this.token) {
			headers.Authorization = `Bearer ${this.token}`;
		}

		const response = await fetch(url, {
			...options,
			headers,
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "An error occurred");
		}

		return response.json();
	}

	// Auth endpoints
	async login(email: string, password: string) {
		return this.request("/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	}

	async getProfile() {
		return this.request("/auth/profile");
	}

	// Team endpoints
	// -------------------------------------------
	async getTeam() {
		return this.request("/team");
	}

	async getTeamStatus() {
		return this.request("/team/status");
	}

	async getPlayersOnTransferList() {
		return this.request("/team/transfer-list");
	}

	// Transfer endpoints
	// ---------------------------------------------------
	async getTransferMarket(filters?: { teamName?: string; name?: string; minPrice?: number; maxPrice?: number }) {
		const params = new URLSearchParams();
		if (filters?.teamName) params.append("teamName", filters.teamName);
		if (filters?.name) params.append("name", filters.name);
		if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
		if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());

		const query = params.toString();
		return this.request(`/transfer/market${query ? `?${query}` : ""}`);
	}

	async addPlayerToTransferList(playerId: string, price: number) {
		return this.request("/transfer/list", {
			method: "POST",
			body: JSON.stringify({ playerId, price }),
		});
	}

	async removePlayerFromTransferList(playerId: string) {
		return this.request(`/transfer/list/${playerId}`, {
			method: "DELETE",
		});
	}

	async buyPlayer(playerId: string) {
		return this.request("/transfer/buy", {
			method: "POST",
			body: JSON.stringify({ playerId }),
		});
	}

	async getTransferHistory() {
		return this.request("/transfer/history");
	}
}

export const apiService = new ApiService();
