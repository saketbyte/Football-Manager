import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { users } from "../models/data.js";
import { JWT_SECRET } from "../middleware/auth.js";

class UserService {
	async findUserByEmail(email) {
		return users.find((user) => user.email === email);
	}

	async createUser(email, password) {
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = {
			id: uuidv4(),
			email,
			password: hashedPassword,
			createdAt: new Date().toISOString()
		};

		users.push(user);
		return user;
	}

	async validatePassword(password, hashedPassword) {
		return await bcrypt.compare(password, hashedPassword);
	}

	generateToken(user) {
		return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
	}

	async authenticateUser(email, password) {
		const user = await this.findUserByEmail(email);

		if (!user) {
			return null;
		}

		const isPasswordValid = await this.validatePassword(password, user.password);
		if (!isPasswordValid) {
			return null;
		}

		return user;
	}
}

export default new UserService();
