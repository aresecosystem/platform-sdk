export const manifest = {
	name: "ARK",
	networks: {
		mainnet: {
			id: "mainnet",
			name: "Mainnet",
			explorer: "https://explorer.ark.io/",
			currency: {
				ticker: "ARK",
				symbol: "Ѧ",
			},
			crypto: {
				slip44: 111,
			},
			hosts: [
				"https://explorer.ark.io",
				"http://5.196.105.32:4003",
				"http://5.196.105.33:4003",
				"http://5.196.105.34:4003",
				"http://5.196.105.35:4003",
				"http://5.196.105.36:4003",
				"http://5.196.105.37:4003",
				"http://5.196.105.38:4003",
				"http://5.196.105.39:4003",
				"http://178.32.65.136:4003",
				"http://178.32.65.137:4003",
				"http://178.32.65.138:4003",
				"http://178.32.65.139:4003",
				"http://178.32.65.140:4003",
				"http://178.32.65.141:4003",
				"http://178.32.65.142:4003",
				"http://178.32.65.143:4003",
				"http://5.196.105.40:4003",
				"http://5.196.105.41:4003",
				"http://5.196.105.42:4003",
				"http://5.196.105.43:4003",
				"http://5.196.105.44:4003",
				"http://5.196.105.45:4003",
				"http://5.196.105.46:4003",
				"http://5.196.105.47:4003",
				"http://54.38.120.32:4003",
				"http://54.38.120.33:4003",
				"http://54.38.120.34:4003",
				"http://54.38.120.35:4003",
				"http://54.38.120.36:4003",
				"http://54.38.120.37:4003",
				"http://54.38.120.38:4003",
				"http://54.38.120.39:4003",
				"http://151.80.125.32:4003",
				"http://151.80.125.33:4003",
				"http://151.80.125.34:4003",
				"http://151.80.125.35:4003",
				"http://151.80.125.36:4003",
				"http://151.80.125.37:4003",
				"http://151.80.125.38:4003",
				"http://151.80.125.39:4003",
				"http://213.32.41.104:4003",
				"http://213.32.41.105:4003",
				"http://213.32.41.106:4003",
				"http://213.32.41.107:4003",
				"http://213.32.41.108:4003",
				"http://213.32.41.109:4003",
				"http://213.32.41.110:4003",
				"http://213.32.41.111:4003",
				"http://5.135.22.92:4003",
				"http://5.135.22.93:4003",
				"http://5.135.22.94:4003",
				"http://5.135.22.95:4003",
				"http://5.135.52.96:4003",
				"http://5.135.52.97:4003",
				"http://5.135.52.98:4003",
				"http://5.135.52.99:4003",
				"http://51.255.105.52:4003",
				"http://51.255.105.53:4003",
				"http://51.255.105.54:4003",
				"http://51.255.105.55:4003",
				"http://46.105.160.104:4003",
				"http://46.105.160.105:4003",
				"http://46.105.160.106:4003",
				"http://46.105.160.107:4003",
			],
		},
		devnet: {
			id: "devnet",
			name: "Devnet",
			explorer: "https://dexplorer.ark.io/",
			currency: {
				ticker: "DARK",
				symbol: "DѦ",
			},
			crypto: {
				slip44: 111,
			},
			hosts: [
				"https://dexplorer.ark.io",
				"http://167.114.29.51:4003",
				"http://167.114.29.52:4003",
				"http://167.114.29.53:4003",
				"http://167.114.29.54:4003",
				"http://167.114.29.55:4003",
			],
		},
	},
	abilities: {
		Client: {
			transaction: true,
			transactions: true,
			wallet: true,
			wallets: true,
			delegate: true,
			delegates: true,
			votes: true,
			voters: true,
			configuration: true,
			fees: true,
			syncing: true,
			broadcast: true,
		},
		Fee: {
			all: true,
		},
		Identity: {
			address: {
				passphrase: true,
				multiSignature: true,
				publicKey: true,
				privateKey: true,
				wif: true,
			},
			publicKey: {
				passphrase: true,
				multiSignature: true,
				wif: true,
			},
			privateKey: {
				passphrase: true,
				wif: true,
			},
			wif: {
				passphrase: true,
			},
			keyPair: {
				passphrase: true,
				privateKey: false,
				wif: true,
			},
		},
		Ledger: {
			getVersion: true,
			getPublicKey: true,
			signTransaction: true,
			signMessage: true,
		},
		Link: {
			block: true,
			transaction: true,
			wallet: true,
		},
		Message: {
			sign: true,
			verify: true,
		},
		Peer: {
			search: true,
		},
		Transaction: {
			transfer: true,
			secondSignature: true,
			delegateRegistration: true,
			vote: true,
			multiSignature: true,
			ipfs: true,
			multiPayment: true,
			delegateResignation: true,
			htlcLock: true,
			htlcClaim: true,
			htlcRefund: true,
		},
	},
};
