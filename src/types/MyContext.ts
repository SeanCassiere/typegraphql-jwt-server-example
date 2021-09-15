import { User } from "#root/entity/User";
import { Request, Response } from "express";

export type AuthRequest = Request & {
	user?: User;
	userId?: number;
};
export interface MyContext {
	req: AuthRequest;
	res: Response;
}
