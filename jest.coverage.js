const baseConfig = require("./jest.config");

module.exports = {
	...baseConfig,
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100,
		},
	},
};