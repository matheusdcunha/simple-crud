import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { errorSchema } from "@/schemas/error-schemas";
import type { FastifyTypedInstance } from "@/types/fastify-typed-instance";
import { UsersRoutes } from "./users";

export async function AppRoutes(app: FastifyTypedInstance) {
	app.register(UsersRoutes, { prefix: "/users" });


	app.get(
		"/health",
		{
			schema: {
				description: "Health Check",
				tags: ["health-check"],
				response: {
					200: z.object({
						status: z.string().describe("Application status"),
						timestamp: z.string().describe("Current timestamp in ISO format"),
					}),
					500: errorSchema.describe("Internal Server Error"),
				},
			},
		}, (_: FastifyRequest, reply: FastifyReply) => {
			reply.status(200).send({
				status: "ok",
				timestamp: new Date().toISOString()
			})
		})
}
