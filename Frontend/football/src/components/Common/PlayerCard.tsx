// PlayerCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Player {
	id: string;
	name: string;
	position: string;
	team: string;
	value: number;
	onTransferList?: boolean;
	askingPrice?: number;
}

interface PlayerCardProps {
	player: Player;
	showActions?: boolean;
	actionType?: "sell" | "buy" | "remove";
	onAction?: (playerId: string, price?: number) => void;
	isActionLoading?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, showActions = false, actionType, onAction, isActionLoading = false }) => {
	const [askingPrice, setAskingPrice] = React.useState(player.value.toString());

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(amount);
	};

	const getPositionColor = (position: string) => {
		switch (position) {
			case "GK":
				return "bg-yellow-100 text-yellow-800";
			case "DEF":
				return "bg-blue-100 text-blue-800";
			case "MID":
				return "bg-green-100 text-green-800";
			case "ATT":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleAction = () => {
		if (actionType === "sell" && onAction) {
			onAction(player.id, parseInt(askingPrice));
		} else if (onAction) {
			onAction(player.id);
		}
	};

	return (
		<Card className='h-full'>
			<CardContent className='p-4'>
				<div className='space-y-3'>
					<div className='flex justify-between items-start'>
						<h3 className='font-semibold text-lg'>{player.name}</h3>
						<Badge className={getPositionColor(player.position)}>{player.position}</Badge>
					</div>

					<div className='text-sm text-gray-600'>
						<p>Team: {player.team}</p>
						<p>Value: {formatCurrency(player.value)}</p>
						{player.onTransferList && player.askingPrice && <p className='font-medium text-green-600'>Asking: {formatCurrency(player.askingPrice)}</p>}
					</div>

					{showActions && (
						<div className='pt-2 border-t'>
							{actionType === "sell" && (
								<div className='space-y-2'>
									<input type='number' value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} placeholder='Asking price' className='w-full px-3 py-2 border rounded-md text-sm' min='1' />
									<Button size='sm' className='w-full' onClick={handleAction} disabled={isActionLoading || !askingPrice}>
										{isActionLoading ? "Adding..." : "Add to Transfer List"}
									</Button>
								</div>
							)}

							{actionType === "buy" && (
								<Button size='sm' className='w-full' onClick={handleAction} disabled={isActionLoading}>
									{isActionLoading ? "Buying..." : `Buy for ${formatCurrency((player.askingPrice || 0) * 0.95)}`}
								</Button>
							)}

							{actionType === "remove" && (
								<Button size='sm' variant='outline' className='w-full' onClick={handleAction} disabled={isActionLoading}>
									{isActionLoading ? "Removing..." : "Remove from List"}
								</Button>
							)}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
