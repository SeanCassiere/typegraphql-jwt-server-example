import { Resolver, Mutation, Arg, Ctx } from "type-graphql";
import bcrypt from "bcryptjs";

import { User } from "#root/entity/User";
import { MyContext } from "#root/types/MyContext";
import { LoginInput } from "./login/LoginInput";
import { AccessToken } from "#root/modules/shared/AccessTokenReturn";
import { generateAccessToken } from "#root/modules/utils/jwt/generateAccessToken";

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

		return generateAccessToken(user, 30);
	}
}
