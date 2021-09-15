import { getConnectionOptions, createConnection } from "typeorm";

import { environmentVariables } from "./env";

export const createTypeormConn = async () => {
	const connectionOptions = await getConnectionOptions(environmentVariables.NODE_ENV);
	return environmentVariables.NODE_ENV === "production"
		? createConnection({
				...connectionOptions,
				url: environmentVariables.DATABASE_URL,
				entities: ["./dist/entity/*.*"],
				name: "default",
		  } as any)
		: createConnection({ ...connectionOptions, name: "default" });
};
