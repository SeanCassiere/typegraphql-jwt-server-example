import { Resolver, Mutation, Ctx } from "type-graphql";

import { MyContext } from "#root/types/MyContext";

@Resolver()
export class LogoutResolver {
	@Mutation(() => Boolean)
	async logout(@Ctx() ctx: MyContext): Promise<boolean> {
		return new Promise<boolean>((res) => {
			ctx.req.userId = undefined;

			ctx.res.clearCookie("qid");
			return res(true);
		});
	}
}
