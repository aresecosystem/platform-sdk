import "jest-extended";

import nock from "nock";

import { createConfig } from "../../test/helpers";
import { KnownWalletService } from "./known-wallets";

let subject: KnownWalletService;

beforeAll(() => nock.disableNetConnect());

beforeEach(async () => (subject = await KnownWalletService.construct(createConfig())));

afterEach(() => nock.cleanAll());

describe("KnownWalletService", () => {
	it("should return a list of known wallets if the request succeeds", async () => {
		const wallets = [
			{
				type: "team",
				name: "ACF Hot Wallet",
				address: "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67",
			},
			{
				type: "team",
				name: "ACF Hot Wallet (old)",
				address: "AWkBFnqvCF4jhqPSdE2HBPJiwaf67tgfGR",
			},
		];

		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(200, wallets);

		await expect(subject.all()).resolves.toEqual(wallets);
	});

	it("should fail to return a list of known wallets if the request fails", async () => {
		nock("https://raw.githubusercontent.com")
			.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
			.reply(404);

		await expect(subject.all()).resolves.toEqual([]);
	});
});