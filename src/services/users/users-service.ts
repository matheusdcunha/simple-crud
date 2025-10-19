import { hash } from "bcryptjs";
import type { UsersRepositoryInterface } from "@/repositories/users/users-repository-interface";
import type { CreateUserDTO } from "./dtos/create-user-dto";
import type { UserResponseDTO } from "./dtos/user-response-dto";

class UseService {
	constructor(private userRepository: UsersRepositoryInterface) {}

	async createUser(data: CreateUserDTO): Promise<UserResponseDTO> {
		const { email, name, password } = data;

		const userWithSameEmail = await this.userRepository.findUserByEmail(email);

		if (userWithSameEmail) {
			throw new Error();
		}

		const hashedPassword = await hash(password, 6);

		const user = { email, name, password: hashedPassword };

		const createdUser = await this.userRepository.createUser(user);

		return { email: createdUser.email, name: createdUser.email };
	}
}
