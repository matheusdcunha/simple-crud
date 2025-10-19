import { PrismaUsersRepository } from "@/repositories/users/prisma-users-repository";
import { UsersService } from "@/services/users/users-service";

export function makeUsersService(): UsersService {
	const repository = new PrismaUsersRepository();
	const service = new UsersService(repository);

	return service;
}
