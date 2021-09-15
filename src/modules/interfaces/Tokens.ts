import { JwtPayload } from "jsonwebtoken";

export interface I_AccessToken extends JwtPayload {
	user: {
		id: number;
		email: string;
	};
}

export interface I_RefreshToken extends JwtPayload {
	user: {
		id: number;
		email: string;
		count: number;
	};
}
