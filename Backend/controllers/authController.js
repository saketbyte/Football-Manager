// controllers/authController.js (ESM format)

import userService from "../services/userService.js";
import teamService from "../services/teamService.js";

class AuthController {
	async loginOrRegister(req, res) {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({ error: "Email and password are required" });
			}

			// Check if user exists
			let user = await userService.findUserByEmail(email);
			let isNewUser = false;

			if (user) {
				const authenticatedUser = await userService.authenticateUser(email, password);
				if (!authenticatedUser) {
					return res.status(401).json({ error: "Invalid credentials" });
				}
				user = authenticatedUser;
			} else {
				// New user - create account
				user = await userService.createUser(email, password);
				isNewUser = true;
			}

			const token = userService.generateToken(user);

			let team = await teamService.getTeamByUserId(user.id);
			let teamCreationInProgress = false;

        }
	}

	async getProfile(req, res) {
		try {
			const user = await userService.findUserByEmail(req.user.email);
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			const team = await teamService.getTeamByUserId(user.id);

			res.json({
			// later
			});
		} catch (error) {
			console.error("Profile error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}

export default new AuthController();
