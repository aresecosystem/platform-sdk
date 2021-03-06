import "jest-extended";

import { createTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";

import { ledger } from "../../test/fixtures/ledger";
import { createConfig } from "../../test/helpers";
import { LedgerService } from "./ledger";

const createMockService = async (record: string) => {
	const transport = await LedgerService.__construct(createConfig());

	await transport.connect(createTransportReplayer(RecordStore.fromString(record)));

	return transport;
};

describe("destruct", () => {
	it("should pass with a resolved transport closure", async () => {
		const xrp = await createMockService("");

		await expect(xrp.__destruct()).resolves.toBeUndefined();
	});
});

describe("getVersion", () => {
	it("should pass with an app version", async () => {
		const xrp = await createMockService(ledger.appVersion.record);

		await expect(xrp.getVersion()).resolves.toEqual(ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const xrp = await createMockService(ledger.publicKey.record);

		await expect(xrp.getPublicKey(ledger.bip44.path)).resolves.toEqual(ledger.publicKey.result);
	});
});

describe("signTransaction", () => {
	it("should pass with a signature", async () => {
		const xrp = await createMockService(ledger.transaction.record);

		await expect(
			xrp.signTransaction(ledger.bip44.path, Buffer.from(ledger.transaction.payload, "hex")),
		).resolves.toEqual(ledger.transaction.result);
	});
});

describe("signMessage", () => {
	it("should fail with a 'NotImplemented' error", async () => {
		const xrp = await createMockService("");

		await expect(xrp.signMessage("", Buffer.alloc(0))).rejects.toThrow();
	});
});
