import type { User } from "@/generated/prisma";

export type CreateUserData = Omit<User, "id">;

export interface UsersRepositoryInterface {
	createUser(data: CreateUserData): Promise<User>;
	// findUserById(id: string): Promise<User | null>;
	findUserByEmail(email: string): Promise<User | null>;
	listUsers(): Promise<User[]>;
}
