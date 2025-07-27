import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Swagger Express API",
			version: "1.0.0",
			description: "Swagger documentation for Football app."
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT"
				}
			}
		},
		security: [
			{
				bearerAuth: []
			}
		]
	},
	tags: [
		{
			name: "auth",
			description: "Endpoints related to authorisation"
		},
		{
			name: "team",
			description: "Endpoints related to team management and status"
		},
		{
			name: "transfer",
			description: "Endpoints related to transfer management and status"
		}
	],
	apis: ["./routes/*.js"] // Path to your API routes
};

const specs = swaggerJsdoc(options);
// console.log(specs);

export { specs, swaggerUi };
