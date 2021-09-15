import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";

import { createSchema } from "#root/utils/createSchema";
import { User } from "#root/entity/User";

interface Options {
	source: string;
	variableValues?: Maybe<{
		[key: string]: any;
	}>;
	userId?: number;
	user?: User;
	headers?: {
		authorization?: string;
	};
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId, user, headers }: Options) => {
	if (!schema) {
		schema = await createSchema();
	}
	return graphql({
		schema,
		source,
		variableValues,
		contextValue: {
			req: {
				userId,
				user,
				headers,
			},
			res: {
				clearCookie: jest.fn(),
				cookie: jest.fn(),
			},
		},
	});
};
