module.exports = {
	preset: "ts-jest",
	testTimeout: 30000,
	testEnvironment: "node",
	testPathIgnorePatterns: ["dist"],
	moduleNameMapper: {
		"#root/(.*)": "<rootDir>/src/$1",
	},
};
