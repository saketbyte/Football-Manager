import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth.ts";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
	const { user, logout } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const isActive = (path: string) => location.pathname === path;

	if (!user) {
		return (
			<nav className='bg-white shadow-md border-b'>
				<div className='container mx-auto px-4'>
					<div className='flex justify-between items-center h-16'>
						<Link to='/' className='text-xl font-bold text-blue-600'>
							Fantasy Football Manager
						</Link>
						<div>
							<Link to='/login'>
								<Button variant='default'>Login</Button>
							</Link>
						</div>
					</div>
				</div>
			</nav>
		);
	}

	return (
		<nav className='bg-white shadow-md border-b'>
			<div className='container mx-auto px-4'>
				<div className='flex justify-between items-center h-16'>
					<Link to='/' className='text-xl font-bold text-blue-600'>
						Fantasy Football Manager
					</Link>

					<div className='flex space-x-6'>
						<Link to='/dashboard' className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/dashboard") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"}`}>
							Dashboard
						</Link>
						<Link to='/profile' className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/profile") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"}`}>
							Profile
						</Link>
						<Link to='/marketplace' className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/marketplace") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"}`}>
							Marketplace
						</Link>
						<Link to='/transfers' className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/transfers") ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600"}`}>
							Transfer History
						</Link>
					</div>

					<div className='flex items-center space-x-4'>
						<span className='text-sm text-gray-600'>Welcome, {user.email}</span>
						<Button variant='outline' onClick={handleLogout}>
							Logout
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
