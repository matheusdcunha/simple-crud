import z from "zod/v4";
import { UsersController } from "@/controllers/users/users-controller";
import { errorSchema } from "@/schemas/error-schemas";
import {
	allUsersBodySchema,
	createUserBodySchema,
	updateUserBodySchema,
	userBodySchema,
} from "@/schemas/users-schemas";
import type { FastifyTypedInstance } from "@/types/fastify-typed-instance";

export async function UsersRoutes(app: FastifyTypedInstance) {
	const usersController = new UsersController();

	app.post(
		"",
		{
			schema: {
				description: "Create a new user",
				tags: ["users"],
				body: createUserBodySchema,
				response: {
					201: userBodySchema.describe("User created"),
					409: errorSchema.describe("User already exists"),
				},
			},
		},
		usersController.createUser,
	);
	app.get(
		"",
		{
			schema: {
				description: "List all users",
				tags: ["users"],
				response: {
					200: allUsersBodySchema.describe("All users"),
					500: errorSchema.describe("Internal Server Error"),
				},
			},
		},
		usersController.listUsers,
	);
	app.get(
		"/:id",
		{
			schema: {
				description: "Find user by ID",
				tags: ["users"],
				response: {
					200: userBodySchema.describe("The user"),
					500: errorSchema.describe("Internal Server Error"),
				},
			},
		},
		usersController.findUserByID,
	);

	app.patch(
		"/:id",
		{
			schema: {
				description: "Update a user",
				tags: ["users"],
				body: updateUserBodySchema,
				response: {
					200: userBodySchema.describe("User updated"),
					404: errorSchema.describe("User not found"),
					409: errorSchema.describe("Email already exists"),
				},
			},
		},
		usersController.updateUser,
	);
}
