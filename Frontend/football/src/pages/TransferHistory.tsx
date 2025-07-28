import React, { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Transfer {
	id: string;
	playerId: string;
	name: string;
	sellerTeamId: string;
	buyerTeamId: string;
	askingPrice: number;
	purchasePrice: number;
	timestamp: string;
}

const TransferHistory: React.FC = () => {
	const [transfers, setTransfers] = useState<Transfer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchTransferHistory();
	}, []);

	const fetchTransferHistory = async () => {
		try {
			setIsLoading(true);
			const response = await apiService.getTransferHistory();
			setTransfers(response.history);
			setError("");
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};
	//
	// 	const formatCurrency = (amount: number) => {
	// 		return new Intl.NumberFormat("en-US", {
	// 			style: "currency",
	// 			currency: "USD",
	// 			minimumFractionDigits: 0,
	// 		}).format(amount);
	// 	};

	// const formatDate = (dateString: string) => {
	// 	return new Date(dateString).toLocaleString();
	// };

	const separateTransfers = (transfers: Transfer[]) => {
		// assuming i have access to current user's team ID
		// In a real implementation, get this from the auth context or API
		return {
			purchases: transfers.filter((t) => t.purchasePrice > 0),
			sales: transfers.filter((t) => t.purchasePrice === 0 || !t.purchasePrice),
			// Assuming sales don't have purchasePrice set
		};
	};

	if (isLoading) {
		return <LoadingSpinner />;
	}

	const { purchases, sales } = separateTransfers(transfers);

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-3xl font-bold'>Transfer History</h1>
				<div className='text-right'>
					<p className='text-sm text-gray-600'>Total Transfers</p>
					<p className='text-2xl font-bold text-blue-600'>{transfers.length}</p>
				</div>
			</div>

			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{transfers.length === 0 && !isLoading ? (
				<Card>
					<CardContent className='p-6 text-center text-gray-500'>No transfer history available yet. Start buying and selling players to see your transfer history here.</CardContent>
				</Card>
			) : (
				<Tabs defaultValue='all' className='space-y-4'>
					<TabsList>
						<TabsTrigger value='all'>All Transfers ({transfers.length})</TabsTrigger>
						<TabsTrigger value='purchases'>Purchases ({purchases.length})</TabsTrigger>
						<TabsTrigger value='sales'>Sales ({sales.length})</TabsTrigger>
					</TabsList>

					<TabsContent value='all'>
						<TransferList transfers={transfers} title='All Transfers' />
					</TabsContent>

					<TabsContent value='purchases'>
						<TransferList transfers={purchases} title='Your Purchases' type='purchase' />
					</TabsContent>

					<TabsContent value='sales'>
						<TransferList transfers={sales} title='Your Sales' type='sale' />
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
};

interface TransferListProps {
	transfers: Transfer[];
	title: string;
	type?: "purchase" | "sale" | "all";
}

const TransferList: React.FC<TransferListProps> = ({ transfers, title, type = "all" }) => {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	if (transfers.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent className='text-center text-gray-500 py-8'>No {type === "purchase" ? "purchases" : type === "sale" ? "sales" : "transfers"} found.</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>
				<div className='divide-y'>
					{transfers.map((transfer) => (
						<div key={transfer.id} className='p-4 hover:bg-gray-50'>
							<div className='flex justify-between items-start'>
								<div className='space-y-1'>
									<h3 className='font-semibold text-lg'>{transfer.name}</h3>
									<p className='text-sm text-gray-600'>Transfer ID: {transfer.id}</p>
									<p className='text-sm text-gray-600'>Date: {formatDate(transfer.timestamp)}</p>
								</div>

								<div className='text-right space-y-2'>
									<div>
										<p className='text-sm text-gray-600'>Asking Price</p>
										<p className='font-semibold'>{formatCurrency(transfer.askingPrice)}</p>
									</div>

									{transfer.purchasePrice && (
										<div>
											<p className='text-sm text-gray-600'>Purchase Price</p>
											<p className='font-semibold text-green-600'>{formatCurrency(transfer.purchasePrice)}</p>
										</div>
									)}

									<div>
										<Badge variant={transfer.purchasePrice ? "default" : "secondary"}>{transfer.purchasePrice ? "Completed" : "Listed"}</Badge>
									</div>
								</div>
							</div>

							{transfer.purchasePrice && (
								<div className='mt-3 pt-3 border-t'>
									<div className='flex justify-between text-sm'>
										<span className='text-gray-600'>Savings:</span>
										<span className='font-medium text-green-600'>{formatCurrency(transfer.askingPrice - transfer.purchasePrice)}</span>
									</div>
									<div className='flex justify-between text-sm'>
										<span className='text-gray-600'>Discount:</span>
										<span className='font-medium text-green-600'>5%</span>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default TransferHistory;
