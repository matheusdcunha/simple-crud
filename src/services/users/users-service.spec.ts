import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRepository } from "@/repositories/users/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { UserNotFoundError } from "./errors/user-not-found-error";
import { UsersService } from "./users-service";

describe("Users Services", () => {

	let userRepository: InMemoryRepository;
	let userService: UsersService;

	describe("create user", async () => {

		beforeEach(async () => {
			userRepository = new InMemoryRepository();
			userService = new UsersService(userRepository);
		});

		it("should be able to create a user", async () => {
			const user = {
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			};

			const userCreated = await userService.createUser(user);

			expect(userCreated).toHaveProperty("id");
			expect(userCreated.email).toEqual("johndoe@email.com");
			expect(userCreated.name).toEqual("John Doe");

			expect(userCreated).not.toHaveProperty("password");
		});

		it("should not be able to create a user with same email as a existing user", async () => {
			userRepository.users.push({
				name: "John Doe",
				email: "johndoe@email.com",
				id: "123123",
				password: "123123",
			});

			const user = {
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			};

			await expect(userService.createUser(user)).rejects.toThrow(
				UserAlreadyExistsError,
			);
		});

		it("should user password must be hashed", async () => {
			const user = {
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			};


			await userService.createUser(user);

			const userCreated = userRepository.users[0]

			const isPasswordHashed = await compare(user.password, userCreated.password);


			expect(isPasswordHashed).toBe(true)
		});
	});

	describe("list users", async () => {

		beforeEach(async () => {
			userRepository = new InMemoryRepository();
			userService = new UsersService(userRepository);
		});

		it("should be able to get all users", async () => {
			const user1 = {
				id: "123123",
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			};

			const user2 = {
				id: "456456",
				email: "vasco@email.com",
				name: "Vasco",
				password: "456456",
			};

			userRepository.users.push(user1, user2);

			const users = await userService.listUsers();

			expect(users.length).toBe(2);
			expect(users[0]).toHaveProperty("name");
			expect(users[0]).toHaveProperty("email");
			expect(users[0]).toHaveProperty("id");

			expect(users).toEqual(
				expect.arrayContaining([expect.objectContaining({ name: "John Doe" })]),
			);
		});
	});

	describe("find user by id", async () => {

		beforeEach(async () => {
			userRepository = new InMemoryRepository();
			userService = new UsersService(userRepository);
		});

		it("should be able to find user by id", async () => {

			const userToCreated = {
				id: "123123",
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			}


			userRepository.users.push(userToCreated);

			const user = await userService.findUserById(userToCreated.id)


			expect(user).toHaveProperty("name");
			expect(user).toHaveProperty("email");
			expect(user).toHaveProperty("id");

			expect(user.name).toEqual(userToCreated.name)

		})

		it("should not te able to find a non-existent user", async () => {
			const notExistentId = "123123"

			await expect(userService.findUserById(notExistentId)).rejects.toThrow(
				UserNotFoundError,
			);
		})

	});

	describe("update user", async () => {

		beforeEach(async () => {
			userRepository = new InMemoryRepository();
			userService = new UsersService(userRepository);
		});

		it("should be able to update a user", async () => {
			const userCreated = {
				id: "123123",
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			};

			userRepository.users.push(userCreated);

			const userToUpdate = {
				email: "vasco@email.com",
				name: "Vasco",
				password: "456"
			}

			const user = await userService.updateUser(userCreated.id, userToUpdate);

			expect(user).toHaveProperty("id");
			expect(user.email).toEqual(userToUpdate.email);
			expect(user.name).toEqual(userToUpdate.name);

			expect(user).not.toHaveProperty("password");
		});

		it("should not te able to update a non-existent user", async () => {
			const notExistentId = "123123"

			await expect(userService.updateUser(notExistentId, { email: "email@email.com" })).rejects.toThrow(
				UserNotFoundError,
			);
		})

		it("should not te able to update with same email as a existing user", async () => {

			userRepository.users.push({
				name: "John Doe",
				email: "johndoe@email.com",
				id: "123123",
				password: "123123",
			});

			userRepository.users.push({
				name: "Vasco",
				email: "vasco@email.com",
				id: "456456",
				password: "456456",
			});

			const user = {
				email: "johndoe@email.com",
			};

			await expect(userService.updateUser("456456", user)).rejects.toThrow(
				UserAlreadyExistsError,
			);
		})

		it("should updated user password must be hash", async () => {

			userRepository.users.push({
				id: "123123",
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			})

			const password = "456456"

			await userService.updateUser("123123", { password })

			const userUpdated = userRepository.users[0]
			const isPasswordHashed = await compare(password, userUpdated.password);

			expect(isPasswordHashed).toBe(true)
		})

	})

	describe("remove user", async () => {
		beforeEach(async () => {
			userRepository = new InMemoryRepository();
			userService = new UsersService(userRepository);
		});

		it("should be able to remove a user", async () => {
			const userCreated = {
				id: "123123",
				email: "johndoe@email.com",
				name: "John Doe",
				password: "123123",
			};

			userRepository.users.push(userCreated);

			const isRemoved = await userService.removeUser(userCreated.id);

			expect(isRemoved).toEqual(true);
			expect(userRepository.users.length).toEqual(0);
		})

		it("should not te able to remove a non-existent user", async () => {
			const notExistentId = "123123"

			await expect(userService.removeUser(notExistentId)).rejects.toThrow(
				UserNotFoundError,
			);
		})
	})

});
