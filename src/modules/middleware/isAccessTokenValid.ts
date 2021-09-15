import { AuthenticationError } from "apollo-server-errors";
import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { MyContext } from "#root/types/MyContext";
import environmentVariables from "#root/utils/env";
import { I_AccessToken } from "../interfaces/Tokens";
import { User } from "#root/entity/User";

const SECRET = environmentVariables.ACCESS_TOKEN_SECRET;

export const isAccessTokenValid: MiddlewareFn<MyContext> = async ({ context }, next) => {
	let token: string = "";

	if (context.req.headers.authorization && context.req.headers.authorization.startsWith("Bearer")) {
		try {
			token = context.req.headers.authorization.split(" ")[1];

			const decoded = verify(token, SECRET) as I_AccessToken;

			const userFound = await User.findOne({ where: { id: decoded.user.id } });

			if (userFound) {
				context.req.user = userFound;
				context.req.userId = decoded.user.id;

				return next();
			} else {
				context.res.status(401);
				throw new AuthenticationError("No User found");
			}
		} catch (error) {
			context.res.status(401);
			throw new AuthenticationError("Not Authorized, token verification failed");
		}
	} else {
		context.res.status(401);
		throw new AuthenticationError("Bearer token not provided");
	}
};
