import { Ctx, Query, Resolver } from "type-graphql";
import { verify } from "jsonwebtoken";

import { User } from "#root/entity/User";
import { MyContext } from "#root/types/MyContext";
import { AccessToken } from "../shared/AccessTokenReturn";
import { generateAccessToken } from "../utils/jwt/generateAccessToken";
import environmentVariables from "#root/utils/env";
import { I_RefreshToken } from "../interfaces/Tokens";

const REFRESH_SECRET = environmentVariables.REFRESH_TOKEN_SECRET;

@Resolver()
export class RefreshAccessTokenResolver {
	@Query(() => AccessToken, { nullable: true })
	async refreshAccessToken(@Ctx() ctx: MyContext): Promise<AccessToken | null> {
		if (!ctx.req.signedCookies["refresh-token"]) {
			return null;
		}

		const user = await isRefreshTokenValid(ctx.req.signedCookies["refresh-token"]);

		if (!user) {
			return null;
		}

		return generateAccessToken(user, 30);
	}
}

async function isRefreshTokenValid(token: string): Promise<User | null> {
	try {
		const decoded = verify(token, REFRESH_SECRET) as I_RefreshToken;

		const userFound = await User.findOne({ where: { id: decoded.user.id } });

		if (!userFound) return null;

		if (userFound.refreshTokenCountTrack !== decoded.user.count) return null;

		return userFound;
	} catch (error) {
		return null;
	}
}
