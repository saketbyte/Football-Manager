import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";
import Navbar from "./components/Layout/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import TransferHistory from "./pages/TransferHistory";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className='min-h-screen bg-gray-50'>
					<Navbar />
					<main className='container mx-auto px-4 py-8'>
						<Routes>
							<Route path='/login' element={<Login />} />
							<Route
								path='/dashboard'
								element={
									<ProtectedRoute>
										<Dashboard />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/profile'
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/marketplace'
								element={
									<ProtectedRoute>
										<Marketplace />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/transfers'
								element={
									<ProtectedRoute>
										<TransferHistory />
									</ProtectedRoute>
								}
							/>
							<Route path='/' element={<Navigate to='/dashboard' replace />} />
						</Routes>
					</main>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;
