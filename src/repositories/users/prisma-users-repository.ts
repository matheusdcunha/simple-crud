import { prisma } from "@/database/prisma";
import type { User } from "@/generated/prisma";
import type {
	CreateUserData,
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
}
