// In-memory data storage (simulating database)
let users = [];
let teams = [];
let transfers = [];

// For reference:
// Team data:
// const team = {
// 					id: uuidv4(),
// 					userId,
// 					budget: 5000000,
// 					players: selectedPlayers,
// 					createdAt: new Date().toISOString()
// 				};

// Each player in selectedPlayers:

// const players[i] = {
// 			...player,
// 			id: uuidv4(), // Give each player instance a unique ID
// 			originalId: player.id,
// 			onTransferList: false,
// 			askingPrice: null
// 		}

// each transfer schema:
// const transfer = {
// 			id: uuidv4(),
// 			playerId: playerId,
// 			name: playerToBuy.name,
// 			sellerTeamId: sellerTeam.id,
// 			buyerTeamId: buyerTeam.id,
// 			askingPrice: playerToBuy.askingPrice,
// 			purchasePrice: purchasePrice,
// 			timestamp: new Date().toISOString(),
// 		};

// Static player pool data
const playerPool = [
	// Goalkeepers
	{ id: "gk1", name: "Manuel Neuer", position: "GK", team: "Bayern Munich", value: 800000 },
	{ id: "gk2", name: "Alisson Becker", position: "GK", team: "Liverpool", value: 1200000 },
	{ id: "gk3", name: "Jan Oblak", position: "GK", team: "Atletico Madrid", value: 1000000 },
	{ id: "gk4", name: "Ederson", position: "GK", team: "Manchester City", value: 900000 },
	{ id: "gk5", name: "Thibaut Courtois", position: "GK", team: "Real Madrid", value: 850000 },
	{ id: "gk6", name: "Gianluigi Donnarumma", position: "GK", team: "PSG", value: 1100000 },

	// Defenders
	{ id: "def1", name: "Virgil van Dijk", position: "DEF", team: "Liverpool", value: 1800000 },
	{ id: "def2", name: "Sergio Ramos", position: "DEF", team: "PSG", value: 1500000 },
	{ id: "def3", name: "Ruben Dias", position: "DEF", team: "Manchester City", value: 1700000 },
	{ id: "def4", name: "Marquinhos", position: "DEF", team: "PSG", value: 1600000 },
	{ id: "def5", name: "Andrew Robertson", position: "DEF", team: "Liverpool", value: 1400000 },
	{ id: "def6", name: "Joao Cancelo", position: "DEF", team: "Manchester City", value: 1500000 },
	{ id: "def7", name: "Raphael Varane", position: "DEF", team: "Manchester United", value: 1300000 },
	{ id: "def8", name: "Alphonso Davies", position: "DEF", team: "Bayern Munich", value: 1200000 },
	{ id: "def9", name: "Trent Alexander-Arnold", position: "DEF", team: "Liverpool", value: 1600000 },
	{ id: "def10", name: "Mats Hummels", position: "DEF", team: "Borussia Dortmund", value: 900000 },
	{ id: "def11", name: "Giorgio Chiellini", position: "DEF", team: "Juventus", value: 800000 },
	{ id: "def12", name: "Cesar Azpilicueta", position: "DEF", team: "Chelsea", value: 1000000 },

	// Midfielders
	{ id: "mid1", name: "Kevin De Bruyne", position: "MID", team: "Manchester City", value: 2500000 },
	{ id: "mid2", name: "N'Golo Kante", position: "MID", team: "Chelsea", value: 2000000 },
	{ id: "mid3", name: "Luka Modric", position: "MID", team: "Real Madrid", value: 1800000 },
	{ id: "mid4", name: "Joshua Kimmich", position: "MID", team: "Bayern Munich", value: 2200000 },
	{ id: "mid5", name: "Casemiro", position: "MID", team: "Manchester United", value: 1900000 },
	{ id: "mid6", name: "Bruno Fernandes", position: "MID", team: "Manchester United", value: 2100000 },
	{ id: "mid7", name: "Pedri", position: "MID", team: "Barcelona", value: 1700000 },
	{ id: "mid8", name: "Mason Mount", position: "MID", team: "Chelsea", value: 1600000 },
	{ id: "mid9", name: "Frenkie de Jong", position: "MID", team: "Barcelona", value: 1800000 },
	{ id: "mid10", name: "Marco Verratti", position: "MID", team: "PSG", value: 1500000 },
	{ id: "mid11", name: "Ilkay Gundogan", position: "MID", team: "Manchester City", value: 1400000 },
	{ id: "mid12", name: "Leon Goretzka", position: "MID", team: "Bayern Munich", value: 1300000 },

	// Attackers
	{ id: "att1", name: "Lionel Messi", position: "ATT", team: "PSG", value: 3500000 },
	{ id: "att2", name: "Cristiano Ronaldo", position: "ATT", team: "Al Nassr", value: 3000000 },
	{ id: "att3", name: "Kylian Mbappe", position: "ATT", team: "PSG", value: 4000000 },
	{ id: "att4", name: "Erling Haaland", position: "ATT", team: "Manchester City", value: 3800000 },
	{ id: "att5", name: "Robert Lewandowski", position: "ATT", team: "Barcelona", value: 3200000 },
	{ id: "att6", name: "Mohamed Salah", position: "ATT", team: "Liverpool", value: 3100000 },
	{ id: "att7", name: "Sadio Mane", position: "ATT", team: "Bayern Munich", value: 2800000 },
	{ id: "att8", name: "Karim Benzema", position: "ATT", team: "Al Ittihad", value: 2900000 },
	{ id: "att9", name: "Neymar Jr", position: "ATT", team: "Al Hilal", value: 3300000 },
	{ id: "att10", name: "Harry Kane", position: "ATT", team: "Bayern Munich", value: 3000000 },
	{ id: "att11", name: "Vinicius Jr", position: "ATT", team: "Real Madrid", value: 2700000 },
	{ id: "att12", name: "Phil Foden", position: "ATT", team: "Manchester City", value: 2400000 },
];

export { users, teams, transfers, playerPool };
console.log("Data module loaded at:", new Date().toISOString());
console.log("-----------------USERS--------------");
console.log(users);
console.log("-----------------TEAMS--------------");
console.log(teams);
