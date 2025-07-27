import express from "express";
import cors from "cors";

// default export of all routers.
import authRoutes from "./routes/auth.js";
import teamRoutes from "./routes/team.js";
import transferRoutes from "./routes/transfer.js";
// documentation libraries
import { specs, swaggerUi } from "./swagger.js";
// authentication
import { authenticateToken } from "./middleware/auth.js";

let app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
// Route for the documentation
app.use("/api/health", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
// Authentication
app.use("/api/auth", authRoutes);
// Adding middleware of authentication on rest of the routes.
app.use("/api/team", authenticateToken, teamRoutes);
app.use("/api/transfer", authenticateToken, transferRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler (Keep this in the last to not block other routes)
app.use("/{*any}", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// serve
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
