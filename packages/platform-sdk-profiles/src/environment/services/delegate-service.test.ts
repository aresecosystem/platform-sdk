import "jest-extended";

import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Request } from "@arkecosystem/platform-sdk-http-got";
import nock from "nock";

import { container } from "../container";
import { Identifiers } from "../container.models";
import { DelegateService } from "./delegate-service";
import { CoinService } from "./coin-service";

let subject: DelegateService;

beforeAll(() => {
	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../../../test/fixtures/client/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../test/fixtures/client/syncing.json"))
		.get("/api/peers")
		.reply(200, require("../../../test/fixtures/client/peers.json"))
		.get("/api/delegates?page=1")
		.reply(200, require("../../../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../../../test/fixtures/client/delegates-2.json"))
		.persist();

	container.set(Identifiers.HttpClient, new Request());
	container.set(Identifiers.CoinService, new CoinService());
	container.set(Identifiers.Coins, { ARK });
});

beforeEach(() => (subject = new DelegateService()));

it("should sync the delegates", async () => {
	expect(() => subject.all("ARK", "devnet")).toThrowError("have not been synchronized yet");

	await subject.sync("ARK", "devnet");

	expect(subject.all("ARK", "devnet")).toBeArray();
	expect(subject.all("ARK", "devnet")).toHaveLength(200);
});

it("should sync the delegates of all coins", async () => {
	expect(() => subject.all("ARK", "devnet")).toThrowError("have not been synchronized yet");

	await subject.syncAll();

	expect(subject.all("ARK", "devnet")).toBeArray();
	expect(subject.all("ARK", "devnet")).toHaveLength(200);
});