import { API_PREFIX, app, SCALAR_ROUTE, SWAGGER_ROUTE } from "./app";
import { env } from "./env";

const port = env.API_PORT;

app
	.listen({
		host: "0.0.0.0",
		port,
	})
	.then(() => {
		console.log(`🌊 HTTP Server Running on port: ${port}`);
		console.log(`🌐 http://localhost:${port}${API_PREFIX}`);
		console.log(`📃 Swagger Docs -> http://localhost:${port}${SWAGGER_ROUTE}`);
		console.log(`🏔️  Scalar Docs -> http://localhost:${port}${SCALAR_ROUTE}`);
	});
