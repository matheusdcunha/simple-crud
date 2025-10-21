import { hash } from "bcryptjs";
import type { UsersRepositoryInterface } from "@/repositories/users/users-repository-interface";
import type { CreateUserDTO } from "./dtos/create-user-dto";
import type { UpdateUserDTO } from "./dtos/update-user-dto";
import type { UserResponseDTO } from "./dtos/user-response-dto";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { UserNotFoundError } from "./errors/user-not-found-error";

export class UsersService {
	constructor(private userRepository: UsersRepositoryInterface) { }

	async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
		const { email, name, password } = data;

		const userWithSameEmail = await this.userRepository.findUserByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const hashedPassword = await hash(password, 6);

		const user = { email, name, password: hashedPassword };

		const createdUser = await this.userRepository.createUser(user);

		return {
			id: createdUser.id,
			email: createdUser.email,
			name: createdUser.name,
		};
	}

	async listUsers(): Promise<UserResponseDTO[]> {
		const rawUsers = await this.userRepository.listUsers();

		const users = rawUsers.map(({ id, email, name }) => {
			return {
				id,
				email,
				name,
			};
		});

		return users;
	}

	async findUserById(id: string): Promise<UserResponseDTO> {
		const rawUser = await this.userRepository.findUserById(id);

		if (rawUser) {
			const { email, name, id } = rawUser;
			const user = { id, email, name };

			return user;
		}

		throw new UserNotFoundError();
	}

	async updateUser(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
		const userExists = await this.userRepository.findUserById(id);

		const { email, name, password } = data;

		if (!userExists) {
			throw new UserNotFoundError();
		}

		if (email) {
			const userWithSameEmail =
				await this.userRepository.findUserByEmail(email);

			if (userWithSameEmail && userWithSameEmail.id !== id) {
				throw new UserAlreadyExistsError();
			}
		}

		let hashedPassword: string | undefined;

		if (password) {
			hashedPassword = await hash(password, 6);
		}

		const rawUpdatedUser = await this.userRepository.updateUser(id, {
			email,
			name,
			password: hashedPassword,
		});

		const { password: _, ...updatedUser } = rawUpdatedUser;

		return updatedUser;
	}

	async removeUser(id: string): Promise<boolean> {
		const userExists = await this.userRepository.findUserById(id);

		if (!userExists) {
			throw new UserNotFoundError();
		}

		const removedUser = await this.userRepository.removeUser(id);

		if (!removedUser) {
			return false;
		}

		return true;
	}
}
