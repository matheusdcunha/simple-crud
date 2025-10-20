import type { FastifyReply, FastifyRequest } from "fastify";
import { makeUsersService } from "@/factories/users/make-users-service";
import { createUserBodySchema, userIdSchema } from "@/schemas/users-schemas";
import type { UserResponseDTO } from "@/services/users/dtos/user-response-dto";
import { UserAlreadyExistsError } from "@/services/users/errors/user-already-exists-error";
import { UserNotFoundError } from "@/services/users/errors/user-not-found-error";

export class UsersController {
	async createUser(request: FastifyRequest, reply: FastifyReply) {
		const { name, email, password } = createUserBodySchema.parse(request.body);

		try {
			const usersService = makeUsersService();
			await usersService.createUser({ name, email, password });
		} catch (error) {
			if (error instanceof UserAlreadyExistsError) {
				return reply.status(409).send({ message: error.message });
			}

			throw error;
		}

		return reply.status(201).send();
	}

	async listUsers(_: FastifyRequest, reply: FastifyReply) {
		const usersService = makeUsersService();
		const users = await usersService.listUsers();

		return reply.status(200).send({ data: users });
	}

	async findUserByID(request: FastifyRequest, reply: FastifyReply) {
		const { id } = userIdSchema.parse(request.params);

		let user: UserResponseDTO;

		try {
			const usersService = makeUsersService();
			user = await usersService.findUserById(id);
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				reply.status(404).send({ message: error.message });
			}

			throw error;
		}

		return reply.status(200).send(user);
	}
}
