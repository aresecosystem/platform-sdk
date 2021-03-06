import "jest-extended";

import nock from "nock";

import { identity } from "../../../test/fixtures/identity";
import { bootContainer } from "../../../test/helpers";
import { StubStorage } from "../../../test/stubs/storage";
import { container } from "../../environment/container";
import { Identifiers } from "../../environment/container.models";
import { Profile } from "../../profiles/profile";
import { ProfileSetting } from "../../profiles/profile.models";
import { ProfileRepository } from "../../repositories/profile-repository";
import { ReadWriteWallet, WalletData } from "../../wallets/wallet.models";
import { ExchangeRateService } from "./exchange-rate-service";

let profile: Profile;
let wallet: ReadWriteWallet;
let subject: ExchangeRateService;

let liveSpy: jest.SpyInstance;
let testSpy: jest.SpyInstance;

beforeAll(() => bootContainer());

beforeEach(async () => {
	nock.cleanAll();

	nock(/.+/)
		// ARK Core
		.get("/api/node/configuration")
		.reply(200, require("../../../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../../../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../../../test/fixtures/client/wallet.json"))
		.get("/api/delegates")
		.reply(200, require("../../../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../../../test/fixtures/client/delegates-2.json"))
		// CryptoCompare
		.get("/data/histoday")
		.query(true)
		.reply(200, require("../../../test/fixtures/markets/cryptocompare/historical.json"))
		.persist();

	const profileRepository = new ProfileRepository();
	subject = new ExchangeRateService();

	container.rebind(Identifiers.ProfileRepository, profileRepository);
	container.rebind(Identifiers.ExchangeRateService, subject);

	profile = profileRepository.create("John Doe");
	profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

	wallet = await profile.wallets().importByMnemonic(identity.mnemonic, "ARK", "ark.devnet");
	wallet.data().set(WalletData.Balance, 1e8);

	liveSpy = jest.spyOn(wallet.network(), "isLive").mockReturnValue(true);
	testSpy = jest.spyOn(wallet.network(), "isTest").mockReturnValue(false);
});

afterEach(() => {
	liveSpy.mockRestore();
	testSpy.mockRestore();
});

beforeAll(() => nock.disableNetConnect());

describe("ExchangeRateService", () => {
	it("should sync a coin for specific profile with wallets argument", async () => {
		nock(/.+/)
			.get("/data/dayAvg")
			.query(true)
			.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
			.persist();

		await subject.syncAll(profile, "DARK");

		expect(wallet.convertedBalance().toNumber()).toBe(0.00005048);
		const allStorage: Record<string, any> = await container.get<StubStorage>(Identifiers.Storage).all();
		expect(allStorage.EXCHANGE_RATE_SERVICE).toMatchObject({ DARK: { BTC: expect.anything() } });
	});

	it("should sync a coin for specific profile without wallets argument", async () => {
		nock(/.+/)
			.get("/data/dayAvg")
			.query(true)
			.reply(200, { BTC: 0.00002134, ConversionType: { type: "direct", conversionSymbol: "" } })
			.persist();

		await subject.syncAll(profile, "DARK");

		expect(wallet.convertedBalance().toNumber()).toBe(0.00002134);
	});

	it("should fail to sync a coin for a specific profile if there are no wallets", async () => {
		profile.wallets().flush();

		expect(wallet.data().get(WalletData.ExchangeCurrency)).toBeUndefined();

		await subject.syncAll(profile, "DARK");

		expect(wallet.data().get(WalletData.ExchangeCurrency)).toBeUndefined();
	});

	it("should store exchange rates and currency in profile wallets if undefined", async () => {
		nock(/.+/)
			.get("/data/dayAvg")
			.query(true)
			.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
			.persist();

		profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

		await subject.syncAll(profile, "DARK");
		expect(wallet.convertedBalance().toNumber()).toBe(0.00005048);
	});

	it("should cache historic exchange rates", async () => {
		nock(/.+/)
			.get("/data/dayAvg")
			.query(true)
			.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
			.persist();

		profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

		await subject.syncAll(profile, "DARK");
		expect(wallet.convertedBalance().toNumber()).toBe(0.00005048);

		nock(/.+/)
			.get("/data/dayAvg")
			.query(true)
			.reply(200, { BTC: 0.00005555, ConversionType: { type: "direct", conversionSymbol: "" } })
			.persist();

		await subject.syncAll(profile, "DARK");
		// The price should be the cached price from previous sync: 0.00005048
		expect(wallet.convertedBalance().toNumber()).toBe(0.00005048);
	});

	it("handle restore", async () => {
		expect(async () => {
			await subject.restore();
		}).not.toThrow();

		expect(await container.get<StubStorage>(Identifiers.Storage).get("EXCHANGE_RATE_SERVICE")).toMatchObject({
			DARK: { BTC: expect.anything() },
		});

		//@ts-ignore
		await container.get<StubStorage>(Identifiers.Storage).set("EXCHANGE_RATE_SERVICE", null);
		expect(async () => {
			await subject.restore();
		}).not.toThrow();

		//@ts-ignore
		await container.get<StubStorage>(Identifiers.Storage).set("EXCHANGE_RATE_SERVICE", undefined);
		expect(async () => {
			await subject.restore();
		}).not.toThrow();
	});
});
