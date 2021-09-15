import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "#root/entity/User";
import { MyContext } from "#root/types/MyContext";
import { isAccessTokenValid } from "../middleware/isAccessTokenValid";

@Resolver()
export class MeResolver {
	@Query(() => User, { nullable: true })
	@UseMiddleware([isAccessTokenValid])
	async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
		if (!ctx.req.userId) {
			return undefined;
		}

		return await User.findOne(ctx.req.userId);
	}
}
