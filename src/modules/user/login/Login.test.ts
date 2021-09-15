import { Connection } from "typeorm";
import faker from "faker";
import bcrypt from "bcryptjs";

import { testConn } from "../../../test-utils/testConn";
import { gCall } from "../../../test-utils/gCall";
import { redis } from "../../../redis";
import { User } from "../../../entity/User";

let conn: Connection;
beforeAll(async () => {
	conn = await testConn();
});
afterAll(async () => {
	redis.quit();
	await conn.close();
});

const loginQuery = `
  mutation LoginQuery($data: LoginInput!) {
    login(data: $data) {
      jwt_token
			jwt_expires_at
    }
  }
`;

describe("Login", () => {
	it("get confirmed user", async () => {
		const userPass = faker.internet.password();
		const user = await User.create({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email().toLowerCase(),
			password: await bcrypt.hash(userPass, 12),
			isEmailConfirmed: true,
		}).save();

		const response = await gCall({
			source: loginQuery,
			variableValues: {
				data: {
					email: user.email,
					password: userPass,
				},
			},
		});

		// console.log("login confirmed user:", response);

		expect(response).toMatchObject({
			data: {
				login: {
					jwt_token: expect.anything(),
					jwt_expires_at: expect.anything(),
				},
			},
		});
	});

	it("return null, email not confirmed", async () => {
		const userPass = faker.internet.password();
		const user = await User.create({
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			email: faker.internet.email().toLowerCase(),
			password: await bcrypt.hash(userPass, 12),
		}).save();

		const response = await gCall({
			source: loginQuery,
			variableValues: {
				data: {
					email: user.email,
					password: userPass,
				},
			},
		});

		expect(response).toMatchObject({
			data: {
				login: null,
			},
		});
	});
});
