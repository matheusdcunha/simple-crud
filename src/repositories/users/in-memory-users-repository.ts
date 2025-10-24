import { randomUUID } from "node:crypto";
import { User } from "@prisma/client";
import type {
	CreateUserData,
	UpdateUserData,
	UsersRepositoryInterface,
} from "@/repositories/users/users-repository-interface";
import { UserNotFoundError } from "@/services/users/errors/user-not-found-error";

export class InMemoryRepository implements UsersRepositoryInterface {
	public users: User[] = [];

	async createUser(data: CreateUserData): Promise<User> {
		const id = randomUUID();

		const user = { id, ...data };

		this.users.push(user);

		return user;
	}

	async listUsers(): Promise<User[]> {
		return this.users;
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = this.users.find((u) => {
			return u.email === email;
		});

		if (!user) {
			return null;
		}

		return user;
	}

	async findUserById(id: string): Promise<User | null> {
		const user = this.users.find((u) => {
			return u.id === id;
		});

		if (!user) {
			return null;
		}

		return user;
	}

	async updateUser(id: string, data: UpdateUserData): Promise<User> {
		let updatedUser: User | null = null;

		this.users = this.users.map((u) => {
			if (u.id === id) {
				const updated = { ...u, ...data };
				updatedUser = updated;
				return updated;
			}

			return u;
		});

		if (!updatedUser) {
			throw new UserNotFoundError();
		}

		return updatedUser;
	}

	async removeUser(id: string): Promise<User> {
		const user = { email: "", name: "", password: "", id: "" };

		this.users = this.users.filter((u) => {
			return u.id !== id;
		});

		return user;
	}
}
