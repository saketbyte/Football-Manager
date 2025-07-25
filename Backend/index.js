import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// app.use(cors());
app.use(express.json());
app.use(
	cors({
		origin: "*",
		methods: ["POST", "GET"],
		credentials: true
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

// Error Solved: Missing argument
// EXPRESS@5 has different syntax. 2025 change.
// Refer - https://expressjs.com/en/guide/migrating-5.html#path-syntax
app.use("/{*any}", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
