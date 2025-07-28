import React, { useEffect, useState, ReactNode } from "react";
import { AuthContext } from "./AuthContext.ts";
import type { AuthContextType } from "./AuthTypes.ts";

import { apiService } from "../services/apiService";

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
	const [isLoading, setIsLoading] = useState(true);
	const [hasTeam, setHasTeam] = useState(false);
	const [teamCreationInProgress, setTeamCreationInProgress] = useState(false);

	useEffect(() => {
		if (token) {
			apiService.setToken(token);
			refreshProfile();
		} else {
			setIsLoading(false);
		}
	}, [token]);

	const refreshProfile = async () => {
		try {
			if (!token) return;

			const response = await apiService.getProfile();
			setUser(response.user);
			setHasTeam(response.hasTeam);
			setTeamCreationInProgress(response.teamCreationInProgress);
		} catch (error) {
			console.error("Failed to fetch profile:", error);
			logout();
		} finally {
			setIsLoading(false);
		}
	};

	const login = async (email: string, password: string) => {
		const response = await apiService.login(email, password);
		const { user, token, hasTeam, teamCreationInProgress } = response;

		localStorage.setItem("token", token);
		setToken(token);
		setUser(user);
		setHasTeam(hasTeam);
		setTeamCreationInProgress(teamCreationInProgress);
		apiService.setToken(token);

		return response;
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
		setHasTeam(false);
		setTeamCreationInProgress(false);
		apiService.setToken(null);
	};

	const value: AuthContextType = {
		user,
		token,
		isLoading,
		login,
		logout,
		hasTeam,
		teamCreationInProgress,
		refreshProfile,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
