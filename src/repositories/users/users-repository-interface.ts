import type { User } from "@prisma/client";

export type CreateUserData = Omit<User, "id">;
export type UpdateUserData = Partial<Omit<User, "id">>;

export interface UsersRepositoryInterface {
	createUser(data: CreateUserData): Promise<User>;
	findUserById(id: string): Promise<User | null>;
	findUserByEmail(email: string): Promise<User | null>;
	listUsers(): Promise<User[]>;
	updateUser(id: string, data: UpdateUserData): Promise<User>;
	removeUser(id: string): Promise<User>;
}
