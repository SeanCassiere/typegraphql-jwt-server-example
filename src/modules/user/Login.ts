import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "#root/entity/User";
import { MyContext } from "#root/types/MyContext";
import { LoginInput } from "./login/LoginInput";
import { AccessToken } from "#root/modules/shared/AccessTokenReturn";
import { generateAccessToken } from "#root/modules/utils/jwt/generateAccessToken";
import { generateRefreshToken } from "../utils/jwt/generateRefreshToken";
import { environmentVariables } from "#root/utils/env";
import { addMinsToCurrentDate } from "../utils/addMinsToCurrentDate";

@Resolver()
export class LoginResolver {
	@Mutation(() => AccessToken, { nullable: true })
	async login(@Arg("data") { email, password }: LoginInput, @Ctx() ctx: MyContext): Promise<AccessToken | null> {
		const user = await User.findOne({ where: { email } });

		if (!user) return null;

		const valid = await bcrypt.compare(password, user.password);

		if (!valid) {
			return null;
		}

		if (!user.isEmailConfirmed) return null;

		ctx.req.userId = user.id;

		ctx.res.cookie("refresh-token", generateRefreshToken(user, 60 * 20), {
			secure: environmentVariables.NODE_ENV === "production" ? true : false,
			expires: addMinsToCurrentDate(60 * 20),
			signed: true,
			httpOnly: true,
		});

		return generateAccessToken(user, 30);
	}
}
