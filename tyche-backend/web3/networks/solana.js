// web3/networks/solana.js
import BaseNetwork from "./BaseNetwork.js";
import createAxiosInstance from "../utils/axiosInstance.js";

class SolanaNetwork extends BaseNetwork {
	constructor(apiKey) {
		super(apiKey);
		this.axios = createAxiosInstance(
			`https://solana-mainnet.g.alchemy.com/v2/${this.apiKey}`
		);
	}

	async getWalletBalance(walletAddress) {
		try {
			const response = await this.axios.post("", {
				jsonrpc: "2.0",
				id: 1,
				method: "getBalance",
				params: [walletAddress],
			});

			const balanceLamports = response.data.result.value;
			const balanceSOL = balanceLamports / 1e9; // Convert lamports to SOL

			return balanceSOL;
		} catch (error) {
			console.error("Error fetching Solana balance:", error);
			throw error;
		}
	}

	async getWalletTokenAccounts(walletAddress) {
		try {
			const response = await this.axios.post("", {
				jsonrpc: "2.0",
				id: 1,
				method: "getTokenAccountsByOwner",
				params: [
					walletAddress,
					{ programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" }, // Solana token program
					{ encoding: "jsonParsed" },
				],
			});

			const tokenAccounts = response.data.result.value;
			const tokens = [];

			for (const accountInfo of tokenAccounts) {
				const tokenAccount = accountInfo.account.data.parsed.info;
				const mintAddress = tokenAccount.mint;
				const tokenBalance = tokenAccount.tokenAmount.uiAmount;

				tokens.push({
					tokenAccount: accountInfo.pubkey,
					mintAddress,
					tokenBalance,
				});

				// fetch additional metadata
				// const metadata = await this.fetchTokenMetadata(mintAddress);
				// tokens[tokens.length - 1].metadata = metadata;
			}

			return tokens;
		} catch (error) {
			console.error("Error fetching Solana token accounts:", error);
			throw error;
		}
	}

	async fetchTokenMetadata(mintAddress) {
		try {
			const response = await this.axios.post("", {
				jsonrpc: "2.0",
				id: 1,
				method: "getTokenSupply",
				params: [mintAddress],
			});

			return response.data.result;
		} catch (error) {
			console.error(`Error fetching metadata for ${mintAddress}:`, error);
			return null;
		}
	}
}

export default SolanaNetwork;
