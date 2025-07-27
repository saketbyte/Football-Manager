import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	// Authorization: Bearer <token>, splitting the header by space.
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Access token required" });
	}

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			return res.status(403).json({ error: "Invalid or expired token" });
		}
		req.user = user;
		// Required because this is a middleware, else the next function in the route will not be executed.
		next();
	});
};

export { authenticateToken, JWT_SECRET };

// will use in all routes except - the one with which we login for the first time.
// api/transfer, api/teams,(index.js to wrap the entire router) api/auth/profile (auth.js of routes to cover only one specific route.)
