import "jest-extended";

import nock from "nock";

import { identity } from "../../../test/fixtures/identity";
import { bootContainer } from "../../../test/helpers";
import { ExtendedTransactionDataCollection } from "../../dto/transaction-collection";
import * as promiseHelpers from "../../helpers/promise";
import { Profile } from "../profile";
import { TransactionAggregate } from "./transaction-aggregate";

let subject: TransactionAggregate;

beforeAll(() => {
	bootContainer();

	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../../../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/configuration")
		.reply(200, require("../../../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../../../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../../../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
		.reply(200, require("../../../test/fixtures/client/wallet.json"))
		.persist();
});

beforeEach(async () => {
	const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

	await profile.wallets().importByMnemonic(identity.mnemonic, "ARK", "ark.devnet");

	subject = new TransactionAggregate(profile);
});

afterAll(() => nock.enableNetConnect());

describe("TransactionAggregate", () => {
	describe.each(["transactions", "sentTransactions", "receivedTransactions"])("%s", (method: string) => {
		it("should have more transactions", async () => {
			nock(/.+/)
				.get("/api/transactions")
				.query(true)
				.reply(200, require("../../../test/fixtures/client/transactions.json"));

			const result = await subject[method]();

			expect(result).toBeInstanceOf(ExtendedTransactionDataCollection);
			expect(result.items()).toHaveLength(100);
		});

		it("should not have more transactions", async () => {
			nock(/.+/)
				.get("/api/transactions")
				.query(true)
				.reply(200, require("../../../test/fixtures/client/transactions-no-more.json"));

			const result = await subject[method]();

			expect(result).toBeInstanceOf(ExtendedTransactionDataCollection);
			expect(result.items()).toHaveLength(100);
			expect(subject.hasMore(method)).toBeFalse();
		});

		it("should skip error responses for processing", async () => {
			nock(/.+/).get("/api/transactions").query(true).reply(404);

			const result = await subject[method]();

			expect(result).toBeInstanceOf(ExtendedTransactionDataCollection);
			expect(result.items()).toHaveLength(0);
			expect(subject.hasMore(method)).toBeFalse();
		});

		it("should skip empty responses for processing", async () => {
			nock(/.+/)
				.get("/api/transactions")
				.query(true)
				.reply(200, require("../../../test/fixtures/client/transactions-empty.json"));

			const result = await subject[method]();

			expect(result).toBeInstanceOf(ExtendedTransactionDataCollection);
			expect(result.items()).toHaveLength(0);
			expect(subject.hasMore(method)).toBeFalse();
		});

		it("should fetch transactions twice and then stop because no more are available", async () => {
			nock(/.+/)
				.get("/api/transactions")
				.query(true)
				.reply(200, require("../../../test/fixtures/client/transactions.json"))
				.get("/api/transactions")
				.query(true)
				.reply(200, require("../../../test/fixtures/client/transactions-no-more.json"));

			// We receive a response that does contain a "next" cursor
			const firstRequest = await subject[method]();

			expect(firstRequest).toBeInstanceOf(ExtendedTransactionDataCollection);
			expect(firstRequest.items()).toHaveLength(100);
			expect(subject.hasMore(method)).toBeTrue();

			// We receive a response that does not contain a "next" cursor
			const secondRequest = await subject[method]();

			expect(secondRequest).toBeInstanceOf(ExtendedTransactionDataCollection);
			expect(secondRequest.items()).toHaveLength(100);
			expect(subject.hasMore(method)).toBeFalse();

			// We do not send any requests because no more data is available
			const thirdRequest = await subject[method]();

			expect(thirdRequest).toBeInstanceOf(ExtendedTransactionDataCollection);
			expect(thirdRequest.items()).toHaveLength(0);
			expect(subject.hasMore(method)).toBeFalse();
		});

		it("should determine if it has more transactions to be requested", async () => {
			nock(/.+/)
				.get("/api/transactions")
				.query(true)
				.reply(200, require("../../../test/fixtures/client/transactions.json"));

			expect(subject.hasMore(method)).toBeFalse();

			await subject[method]();

			expect(subject.hasMore(method)).toBeTrue();
		});

		it("should flush the history", async () => {
			nock(/.+/)
				.get("/api/transactions")
				.query(true)
				.reply(200, require("../../../test/fixtures/client/transactions.json"));

			expect(subject.hasMore(method)).toBeFalse();

			await subject[method]();

			expect(subject.hasMore(method)).toBeTrue();

			subject.flush(method);
		});
	});

	it("should flush all the history", async () => {
		nock(/.+/)
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../../../test/fixtures/client/transactions.json"));

		expect(subject.hasMore("transactions")).toBeFalse();

		await subject.transactions();

		expect(subject.hasMore("transactions")).toBeTrue();

		subject.flush();
	});

	it("should handle undefined  promiseAllSettledByKey responses in aggregate", async () => {
		nock(/.+/)
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../../../test/fixtures/client/transactions.json"));

		const promiseAllSettledByKeyMock = jest
			.spyOn(promiseHelpers, "promiseAllSettledByKey")
			//@ts-ignore
			.mockImplementation(() => {
				return Promise.resolve(undefined);
			});

		const results = await subject.transactions();
		expect(results).toBeInstanceOf(ExtendedTransactionDataCollection);
		promiseAllSettledByKeyMock.mockRestore();
	});

	it("should aggregate and filter transactions based on provided addresses", async () => {
		nock(/.+/)
			.get("/api/transactions")
			.query(true)
			.reply(200, require("../../../test/fixtures/client/transactions.json"));

		const result = await subject.transactions({ addresses: ["D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD"] });
		expect(result).toBeInstanceOf(ExtendedTransactionDataCollection);
		//@ts-ignore
		expect(result.items()).toHaveLength(0);

		subject.flush();
	});
});
