import z from "zod/v4";
import { UsersController } from "@/controllers/users/users-controller";
import { errorSchema } from "@/schemas/error-schemas";
import {
	allUsersBodySchema,
	createUserBodySchema,
} from "@/schemas/users-schemas";
import type { FastifyTypedInstance } from "@/types/fastify-typed-instance";

export async function UsersRoutes(app: FastifyTypedInstance) {
	const userController = new UsersController();

	app.post(
		"/",
		{
			schema: {
				description: "Create a new user",
				tags: ["users"],
				body: createUserBodySchema,
				response: {
					201: z.null().describe("User created"),
					409: errorSchema.describe("User already exists"),
				},
			},
		},
		userController.createUser,
	);
	app.get(
		"/",
		{
			schema: {
				description: "List all users",
				tags: ["users"],
				response: {
					200: allUsersBodySchema.describe("All users"),
				},
			},
		},
		userController.listUsers,
	);
	app.get("/:id", userController.findUserByID);
}
