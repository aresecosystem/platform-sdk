import { Coins } from "@arkecosystem/platform-sdk";

const network: Coins.CoinNetwork = {
	id: "avax.testnet",
	type: "live",
	name: "AVAX Testnet",
	explorer: "https://explorer.avax-test.network/",
	currency: {
		ticker: "FUJI",
		symbol: "FUJI",
	},
	crypto: {
		networkId: "5",
		blockchainId: "2JVSBoinj9C2J33VntvzYtVJNZdN2NKiwwKjcumHUWEb5DbBrm",
		assetId: "U8iRqJoiJm8xZHAacmvYyZVwqQx6uDNtQeP3CQ6fcgQk3JqnK",
		signingMethods: {
			privateKey: true,
		},
	},
	networking: {
		hosts: ["https://api.avax-test.network:443"],
		hostsArchival: ["https://api.avax-test.network:8080"],
	},
	governance: {
		voting: {
			enabled: false,
			delegateCount: 0,
			maximumPerWallet: 0,
			maximumPerTransaction: 0,
		},
	},
	featureFlags: {
		Client: {
			transactions: true,
			wallet: true,
			broadcast: true,
		},
		Identity: {
			address: {
				mnemonic: true,
			},
			publicKey: {
				mnemonic: true,
			},
			privateKey: {
				mnemonic: true,
			},
			keyPair: {
				mnemonic: true,
				privateKey: true,
			},
		},
		Message: {
			sign: true,
			verify: true,
		},
		Miscellaneous: {
			utxo: true,
		},
	},
};

export default network;
