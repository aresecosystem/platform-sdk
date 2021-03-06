import { MarketTransformer } from "./market-transformer";

const stubResponse = require("../../test/fixtures/market.json");
const stubOptions = { type: "day", dateFormat: "DD.MM", token: "ARK" };

describe("MarketTransformer", function () {
	it("should transform the given data", async () => {
		const subject = new MarketTransformer(stubResponse);

		expect(subject.transform(stubOptions)).toMatchSnapshot();
	});

	it("should skip unknown currencies", async () => {
		const subject = new MarketTransformer(stubResponse);

		expect(subject.transform({ ...stubOptions, currencies: { invalid: {} } })).toMatchSnapshot();
	});
});
