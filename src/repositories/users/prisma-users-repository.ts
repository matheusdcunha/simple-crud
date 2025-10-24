import type { User } from "@prisma/client";
import { prisma } from "@/database/prisma";
import type {
	CreateUserData,
	UpdateUserData,
	UsersRepositoryInterface,
} from "./users-repository-interface";

export class PrismaUsersRepository implements UsersRepositoryInterface {
	async createUser(data: CreateUserData) {
		const { email, name, password } = data;

		const user = await prisma.user.create({
			data: { email, name, password },
		});

		return user;
	}

	async listUsers() {
		const users = await prisma.user.findMany();

		return users;
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = await prisma.user.findFirst({ where: { email } });

		return user;
	}

	async findUserById(id: string): Promise<User | null> {
		const user = await prisma.user.findFirst({ where: { id } });

		return user;
	}

	async updateUser(id: string, data: UpdateUserData): Promise<User> {
		const updatedUser = await prisma.user.update({ where: { id }, data });

		return updatedUser;
	}

	async removeUser(id: string): Promise<User> {
		const removedUser = await prisma.user.delete({ where: { id } });

		return removedUser;
	}
}
