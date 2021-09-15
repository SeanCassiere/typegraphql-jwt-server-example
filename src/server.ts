import http from "http";
import Express from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";

import { MyContext } from "./types/MyContext";
import { createSchema } from "./utils/createSchema";
import { createTypeormConn } from "./utils/createTypeormConn";

import { environmentVariables } from "./utils/env";

const PORT = environmentVariables.PORT;

const app = Express();
const httpServer = http.createServer(app);

export const startServer = async () => {
	await createTypeormConn();

	const schema = await createSchema();

	const apolloServer = new ApolloServer({
		introspection: true,
		playground: true,
		schema,
		context: (ctx: MyContext) => ctx,
	});

	app.use(
		cors({
			origin: (_, cb) => cb(null, true),
			credentials: true,
		})
	);

	await apolloServer.start();

	apolloServer.applyMiddleware({
		app,
		cors: false,
	});

	httpServer.listen({ port: PORT }, () => {
		console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
	});
};
