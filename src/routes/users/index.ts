import type { FastifyInstance } from "fastify";
import { UsersController } from "@/controllers/users/users-controller";

export async function UsersRoutes(app: FastifyInstance) {
	const userController = new UsersController();

	app.post("/", userController.createUser);
	app.get("/", userController.listUsers);
	app.get("/:id", userController.findUserByID);
}
