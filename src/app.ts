import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import scalarApiReference from "@scalar/fastify-api-reference";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { ZodError } from "zod/v4";
import { env } from "./env";
import { AppRoutes } from "./routes";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

export const API_PREFIX = "/api"
export const SWAGGER_ROUTE = `${API_PREFIX}/docs`
export const SCALAR_ROUTE = `${API_PREFIX}/reference`

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, { origin: "*" });

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Simple Crud API",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(AppRoutes, { prefix: API_PREFIX });

app.register(fastifySwaggerUi, { routePrefix: SWAGGER_ROUTE });

app.register(scalarApiReference, {
	routePrefix: SCALAR_ROUTE,
	configuration: {
		spec: {
			url: "/docs/json",
		},
	},
});

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error", issues: error.format() });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	}

	return reply.status(500).send({ message: "Internal server error" });
});
