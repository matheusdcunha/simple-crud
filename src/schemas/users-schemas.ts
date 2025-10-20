import { z } from "zod/v4";

export const createUserBodySchema = z.object({
	name: z.string(),
	email: z.email(),
	password: z.string().min(4),
});

export const userIdSchema = z.object({
	id: z.uuidv4(),
});

export const userBodySchema = z.object({
	id: z.uuidv4(),
	name: z.string(),
	email: z.email(),
});

export const allUsersBodySchema = z.object({
	data: z.array(userBodySchema),
});

export const updateUserBodySchema = z.object({
	name: z.string().optional(),
	email: z.email().optional(),
	password: z.string().min(4).optional(),
});
