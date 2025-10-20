import type { FastifyTypedInstance } from "@/types/fastify-typed-instance";
import { UsersRoutes } from "./users";

export async function AppRoutes(app: FastifyTypedInstance) {
	app.register(UsersRoutes, { prefix: "/users" });
}
