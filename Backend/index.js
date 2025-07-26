import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import transferRoutes from "./routes/transfer.js";

import { authenticateToken } from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/team", authenticateToken, teamRoutes);
app.use("/api/transfer", authenticateToken, transferRoutes);

// Health check
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("/{*any}", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
