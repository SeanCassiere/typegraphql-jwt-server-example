import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class AccessToken {
	@Field()
	jwt_token: string;

	@Field()
	jwt_expires_at: number;
}
