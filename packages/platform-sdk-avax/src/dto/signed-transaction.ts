import { Contracts, DTO } from "@arkecosystem/platform-sdk";
import { BigNumber } from "@arkecosystem/platform-sdk-support";

export class SignedTransactionData
	extends DTO.AbstractSignedTransactionData
	implements Contracts.SignedTransactionData {
	public sender(): string {
		return "";
	}

	public recipient(): string {
		return "";
	}

	public amount(): BigNumber {
		return BigNumber.ZERO;
	}

	public fee(): BigNumber {
		return BigNumber.ZERO;
	}

	public isMultiSignature(): boolean {
		return false;
	}

	public isMultiSignatureRegistration(): boolean {
		return false;
	}
}
