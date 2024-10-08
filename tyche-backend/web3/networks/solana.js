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

	////////////////////////////////////////
	// Transaction methods
	////////////////////////////////

	/**
	 * Fetches all transactions for a given wallet address.
	 * @param {string} walletAddress - The wallet address to fetch transactions for.
	 * @returns {Array} - An array of transaction objects.
	 */
	async getAllTransactions(walletAddress) {
		try {
			const response = await this.axios.post("", {
				jsonrpc: "2.0",
				id: 1,
				method: "getSignaturesForAddress",
				params: [
					walletAddress,
					{
						limit: 1000,
					},
				],
			});

			const transactions = response.data.result;

			// Convert Unix timestamps to JavaScript Date objects, add as 'date' field
			transactions.forEach((tx) => {
				tx.date = new Date(tx.blockTime * 1000); // Convert Unix timestamp to JavaScript Date
			});

			return transactions;
		} catch (error) {
			console.error("Error fetching Solana transactions:", error);
			throw error;
		}
	}

	/**
	 * Fetches the first transaction (earliest) for a given wallet address.
	 * @param {string} walletAddress - The wallet address to fetch the first transaction for.
	 * @returns {Object|null} - The first transaction object or null if no transactions found.
	 */
	async getFirstTransaction(walletAddress) {
		try {
			const transactions = await this.getAllTransactions(walletAddress);

			if (!transactions || transactions.length === 0) {
				return null;
			}

			// Assuming transactions are returned in descending order (newest first)
			// To get the earliest, sort them in ascending order based on slot or block time
			const sortedTransactions = transactions.sort((a, b) => a.slot - b.slot);
			const firstTx = sortedTransactions[0];

			return {
				transactionId: firstTx.signature,
				date: new Date(firstTx.blockTime * 1000), // Convert Unix timestamp to JavaScript Date
			};
		} catch (error) {
			console.error("Error fetching first Solana transaction:", error);
			throw error;
		}
	}

	/**
	 * Fetches the last transaction (most recent) for a given wallet address.
	 * @param {string} walletAddress - The wallet address to fetch the last transaction for.
	 * @returns {Object|null} - The last transaction object or null if no transactions found.
	 */
	async getLastTransaction(walletAddress) {
		try {
			const transactions = await this.getAllTransactions(walletAddress);

			if (!transactions || transactions.length === 0) {
				return null;
			}

			// Assuming transactions are returned in descending order (newest first)
			const lastTx = transactions[0];

			return {
				transactionId: lastTx.signature,
				date: new Date(lastTx.blockTime * 1000), // Convert Unix timestamp to JavaScript Date
			};
		} catch (error) {
			console.error("Error fetching last Solana transaction:", error);
			throw error;
		}
	}

	/**
	 * Fetches detailed transaction information by transaction ID.
	 * @param {string} txid - The transaction ID.
	 * @returns {Object} - Detailed transaction information.
	 */
	async getTransactionDetails(txid) {
		try {
			const response = await this.axios.post("", {
				jsonrpc: "2.0",
				id: 1,
				method: "getTransaction",
				params: [
					txid,
					{
						encoding: "jsonParsed",
						commitment: "finalized",
						maxSupportedTransactionVersion: 0,
					},
				],
			});

			const tx = response.data.result;

			if (!tx) {
				console.log(`No transaction details found for ${txid}`);
				return null;
			}

			const date = tx.blockTime ? new Date(tx.blockTime * 1000) : null;
			const feeLamports = tx.meta?.fee || 0;
			const feeSOL = feeLamports / 1e9;

			let from = null;
			let to = null;
			let asset = null;
			let amount = null;

			const instructions = tx.transaction.message.instructions;
			const accountKeys = tx.transaction.message.accountKeys;
			const preBalances = tx.meta.preBalances;
			const postBalances = tx.meta.postBalances;

			console.log("Parsed Instructions:", instructions);

			// First account is the payer
			from = accountKeys[0];

			// Calculate the total SOL spent by the sender
			const lamportsSpent = preBalances[0] - postBalances[0];
			amount = lamportsSpent / 1e9; // Convert lamports to SOL
			asset = "SOL";

			console.log(`Sender ${from} spent ${amount} SOL`);

			// Optionally, find the recipient from the instruction data
			// For associated token account creation, the recipient is in the instruction
			for (const instruction of instructions) {
				if (instruction.parsed && instruction.parsed.type === "create") {
					to = instruction.parsed.info.wallet;
					break;
				}
			}

			return {
				transactionId: txid,
				date,
				gasFee: {
					lamports: feeLamports,
					sol: feeSOL,
				},
				from,
				to,
				asset,
				amount,
			};
		} catch (error) {
			console.error("Error fetching Solana transaction details:", error);
			throw error;
		}
	}
}

export default SolanaNetwork;
