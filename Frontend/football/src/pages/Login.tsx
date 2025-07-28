import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { login, user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/dashboard");
		}
	}, [user, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			await login(email, password);
			navigate("/dashboard");
		} catch (err) {
			setError(err.message || "Login failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-[calc(100vh-4rem)]'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl text-center'>Welcome</CardTitle>
					<CardDescription className='text-center'>Enter your email and password to login or register</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						{error && (
							<Alert variant='destructive'>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<div className='space-y-2'>
							<label htmlFor='email' className='text-sm font-medium'>
								Email
							</label>
							<Input id='email' type='email' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} />
						</div>

						<div className='space-y-2'>
							<label htmlFor='password' className='text-sm font-medium'>
								Password
							</label>
							<Input id='password' type='password' placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} minLength={6} />
						</div>

						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? "Processing..." : "Login / Register"}
						</Button>
					</form>

					<div className='mt-4 text-center text-sm text-gray-600'>
						<p>New users will be automatically registered and assigned a team.</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
