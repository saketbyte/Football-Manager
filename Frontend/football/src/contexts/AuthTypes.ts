export interface User {
	id: string;
	email: string;
}

export interface AuthContextType {
	user: User | null;
	token: string | null;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<never>;
	logout: () => void;
	hasTeam: boolean;
	teamCreationInProgress: boolean;
	refreshProfile: () => Promise<void>;
}
