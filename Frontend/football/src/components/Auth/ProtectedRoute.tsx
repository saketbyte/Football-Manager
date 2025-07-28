import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth.ts";
import LoadingSpinner from "../Common/LoadingSpinner";

interface ProtectedRouteProps {
	children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return <Navigate to='/login' replace />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
