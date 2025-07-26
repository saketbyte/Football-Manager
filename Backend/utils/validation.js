const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

const validatePassword = (password) => {
	// Minimum 6 characters
	return password && password.length >= 6;
};

const validatePrice = (price) => {
	return typeof price === "number" && price > 0;
};

const sanitizeInput = (input) => {
	if (typeof input !== "string") return input;
	return input.trim();
};

module.exports = {
	validateEmail,
	validatePassword,
	validatePrice,
	sanitizeInput
};
