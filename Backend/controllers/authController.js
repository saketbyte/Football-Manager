import userService from "../services/userService.js"; //f(u): authenticate, create, findUserByEmail, generateToken
import teamService from "../services/teamService.js"; //f(t):  getTeam, createTeam
import { validateEmail, validatePassword } from "../utils/validators.js";

class AuthController {
	async loginOrRegister(req, res) {
		try {
			// console.log(`Request Body authController: loginOrRegister ${JSON.parse(req)}`);
			console.log("Raw Body Type:", typeof req.body);
			console.log("Raw Body Keys:", Object.keys(req.body));
			console.log("Raw Body:", req.body);

			// Extract the email and pwd
			const { email, password } = req.body;

			// validate email format and password length.

			if (!validateEmail(email)) return res.status(400).json({ error: "Email format is not valid" });

			if (!validatePassword(password)) return res.status(400).json({ error: "Password must be > 6 characters" });

			// If either is missing return
			if (!email || !password) {
				return res.status(400).json({ error: "Email and password are required" });
			}

			// Check if user exists
			let user = await userService.findUserByEmail(email);
			// flag will be used later
			let isNewUser = false;

			if (user) {
				// Existing user - validate password
				const authenticatedUser = await userService.authenticateUser(email, password);

				if (!authenticatedUser) {
					return res.status(401).json({ error: "Invalid credentials" });
				}
				user = authenticatedUser;
			} else {
				// New user - create account
				// Add later: email otp - https://sandydev.medium.com/how-to-implement-otp-verification-in-authentication-system-with-express-js-and-mongodb-c4f1c1314aed
				user = await userService.createUser(email, password);
				isNewUser = true;
			}

			// Generate token
			const token = userService.generateToken(user);

			// Check if user has a team
			let team = await teamService.getTeamByUserId(user.id);
			let teamCreationInProgress = false;

			if (!team && isNewUser) {
				// Start team creation process for new users
				teamCreationInProgress = true;
				// SEPARATE PROCESS OF TEAM CREATION.
				// Create team asynchronously (don't await) <-- Will happen in the background
				teamService.createTeam(user.id).catch((error) => {
					console.error("Error creating team:", error);
				});
			}
			// response to sent back.
			res.json({
				success: true,
				user: {
					id: user.id,
					email: user.email
				},
				token,
				isNewUser,
				//Using !!team is a safe way to get a consistent boolean to avoid null values
				hasTeam: !!team,
				teamCreationInProgress
			});
		} catch (error) {
			console.error("Auth error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getProfile(req, res) {
		// userService exported me an object of UserService class.
		try {
			// UserService functions
			const user = await userService.findUserByEmail(req.user.email);
			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}
			// TeamService class function
			const team = await teamService.getTeamByUserId(user.id);
			// Profile response schema. Same as user schema on login but without token!
			res.json({
				user: {
					id: user.id,
					email: user.email
				},
				hasTeam: !!team,
				teamCreationInProgress: !team
			});
		} catch (error) {
			console.error("Profile error:", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}
}

export default new AuthController();
