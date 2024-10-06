class BaseNetwork {
	constructor(apiKey) {
		if (new.target === BaseNetwork) {
			throw new TypeError("Cannot construct BaseNetwork instances directly");
		}
		this.apiKey = apiKey;
	}

	async getWalletBalance(walletAddress) {
		throw new Error("Method 'getWalletBalance()' must be implemented.");
	}

	async getWalletTokenAccounts(walletAddress) {
		throw new Error("Method 'getWalletTokenAccounts()' must be implemented.");
	}

	async getWalletTransactions(walletAddress) {
		throw new Error("Method 'getWalletTransactions()' must be implemented.");
	}
}

export default BaseNetwork;
