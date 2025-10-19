import type { FastifyInstance } from "fastify";
import { UsersRoutes } from "./users";

export async function AppRoutes(app: FastifyInstance) {
	app.register(UsersRoutes, { prefix: "/users" });
}
