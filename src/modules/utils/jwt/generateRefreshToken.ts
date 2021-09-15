import { sign } from "jsonwebtoken";

import { environmentVariables } from "#root/utils/env";
import { User } from "#root/entity/User";
import { I_RefreshToken } from "#root/modules/interfaces/Tokens";

const REFRESH_SECRET = environmentVariables.REFRESH_TOKEN_SECRET;

function signRefreshToken(user: User, mins: number) {
	const serviceParams: I_RefreshToken = {
		user: {
			id: user.id,
			email: user.email,
			count: user.refreshTokenCountTrack,
		},
	};
	return sign({ ...serviceParams }, REFRESH_SECRET, { expiresIn: `${mins}m` });
}

export function generateRefreshToken(user: User, mins: number) {
	const refreshToken = signRefreshToken(user, mins);
	return refreshToken;
}
