import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { users } from "../models/data.js";
import { JWT_SECRET } from "../middleware/auth.js";

// Using classes in Service to maintain encapsulation and Singleton design pattern.
class UserService {
	// function: used in authController for finding pre-existing user.
	async findUserByEmail(email) {
		return users.find((user) => user.email === email); // bool
	}

	// function: used in authController to create new user if email not found in DB.
	async createUser(email, password) {
		// security of password. Salting/Hashing.
		const hashedPassword = await bcrypt.hash(password, 10);

		//Schema of user
		const user = {
			id: uuidv4(),
			email,
			password: hashedPassword,
			createdAt: new Date().toISOString()
		};
		// ideally this would be added to database but storing in memory for demo purposes.
		users.push(user);
		console.log("Current User List from models:", users);
		return user;
	}

	// private function: comparing the 2 hashes. (private)
	async #validatePassword(password, hashedPassword) {
		return await bcrypt.compare(password, hashedPassword);
	}

	// function: New token for current user session [TOKEN CREATION]
	generateToken(user) {
		return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
	}

	// function: Authenticating the password
	async authenticateUser(email, password) {
		const user = await this.findUserByEmail(email);

		// sanity checkkk
		if (!user) {
			return null;
		}
		// compares the passwords [stored vs entered]
		const isPasswordValid = await this.#validatePassword(password, user.password);
		if (!isPasswordValid) {
			return null; // any falsy value
		}

		return user;
	}
}

// Exporting a globally used instance of this class - same for all
export default new UserService();
