import { sign, decode, JwtPayload } from "jsonwebtoken";

import { environmentVariables } from "#root/utils/env";
import { User } from "#root/entity/User";

const SERVER_HOST = environmentVariables.SERVER_HOST;
const SECRET = environmentVariables.ACCESS_TOKEN_SECRET;

function signAccessToken(user: User, mins: number) {
	const serviceParams = {
		[SERVER_HOST]: {
			user: {
				id: user.id,
				email: user.email,
			},
		},
	};
	return sign({ ...serviceParams }, SECRET, { expiresIn: `${mins}m` });
}

function decodeExpirationTimeFromToken(token: string) {
	let expirationTime = 0;

	const decoded = decode(token);

	if (decoded) {
		const data = decoded as JwtPayload;
		expirationTime = data.exp ? data.exp : 0;
	}

	return expirationTime;
}

export function generateAccessToken(user: User, mins: number) {
	const token = signAccessToken(user, mins);
	const expirationTime = decodeExpirationTimeFromToken(token);

	return { jwt_token: token, jwt_expires_at: expirationTime };
}
