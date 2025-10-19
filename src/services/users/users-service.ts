import { hash } from "bcryptjs";
import type { UsersRepositoryInterface } from "@/repositories/users/users-repository-interface";
import type { CreateUserDTO } from "./dtos/create-user-dto";
import type { UserResponseDTO } from "./dtos/user-response-dto";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { UserNotFoundError } from "./errors/user-not-found-error";

export class UsersService {
	constructor(private userRepository: UsersRepositoryInterface) {}

	async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
		const { email, name, password } = data;

		const userWithSameEmail = await this.userRepository.findUserByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const hashedPassword = await hash(password, 6);

		const user = { email, name, password: hashedPassword };

		const createdUser = await this.userRepository.createUser(user);

		return { email: createdUser.email, name: createdUser.email };
	}

	async listUsers(): Promise<UserResponseDTO[]> {
		const rawUsers = await this.userRepository.listUsers();

		const users = rawUsers.map(({ email, name }) => {
			return {
				email,
				name,
			};
		});

		return users;
	}

	async findUserById(id: string): Promise<UserResponseDTO> {
		const rawUser = await this.userRepository.findUserById(id);

		if (rawUser) {
			const { email, name } = rawUser;
			const user = { email, name };

			return user;
		}

		throw new UserNotFoundError();
	}
}
