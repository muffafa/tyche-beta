import BaseNetwork from "./BaseNetwork.js";
import createAxiosInstance from "../utils/axiosInstance.js";
import { TokenListProvider } from "@solana/spl-token-registry";
import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

class SolanaNetwork extends BaseNetwork {
	constructor(apiKey) {
		super(apiKey);
		this.apiKey = apiKey;
		this.rpcEndpoint = `https://solana-mainnet.g.alchemy.com/v2/${this.apiKey}`;
		this.axios = createAxiosInstance(this.rpcEndpoint);
		this.tokenList = [];
		this.tokenListInitialized = false;
		this.tokenListPromise = this.initializeTokenList();

		// Initialize Solana connection and Metaplex instance
		this.connection = new Connection(this.rpcEndpoint);
		this.metaplex = Metaplex.make(this.connection);
	}

	/**
	 * Initializes the token list by fetching it from the token registry.
	 */
	async initializeTokenList() {
		try {
			const tokenListContainer = await new TokenListProvider().resolve();
			this.tokenList = tokenListContainer
				.filterByClusterSlug("mainnet-beta")
				.getList();
			console.log(
				"Token list initialized with",
				this.tokenList.length,
				"tokens."
			);
			this.tokenListInitialized = true;
		} catch (error) {
			console.error("Error initializing token list:", error);
		}
	}

	/**
	 * Ensures that the token list is initialized before proceeding.
	 */
	async ensureTokenListInitialized() {
		if (!this.tokenListInitialized) {
			await this.tokenListPromise;
		}
	}

	/**
	 * Retrieves the token metadata for a given mint address from the token list.
	 * @param {string} mintAddress - The mint address of the token.
	 * @returns {Object|null} - Token metadata or null if not found.
	 */
	getTokenInfo(mintAddress) {
		const tokenInfo = this.tokenList.find((t) => t.address === mintAddress);
		if (tokenInfo) {
			return {
				symbol: tokenInfo.symbol,
				name: tokenInfo.name,
				decimals: tokenInfo.decimals,
			};
		} else {
			// Token not found in the registry
			return null;
		}
	}

	/**
	 * Fetches the token decimals from the mint account.
	 * @param {string} mintAddress - The mint address of the token.
	 * @returns {number} - The decimals of the token.
	 */
	async getTokenDecimals(mintAddress) {
		try {
			const response = await this.axios.post("", {
				jsonrpc: "2.0",
				id: 1,
				method: "getAccountInfo",
				params: [
					mintAddress,
					{
						encoding: "base64",
					},
				],
			});

			const accountInfo = response.data.result.value;
			if (accountInfo === null) {
				console.error(`No account info found for mint address ${mintAddress}`);
				return 0;
			}

			const data = accountInfo.data[0]; // base64 encoded data
			const buffer = Buffer.from(data, "base64");

			// The decimals byte is at offset 44
			const decimals = buffer.readUInt8(44);

			return decimals;
		} catch (error) {
			console.error(`Error fetching mint account for ${mintAddress}:`, error);
			return 0;
		}
	}

	/**
	 * Fetches the token metadata (name and symbol) using Metaplex.
	 * @param {string} mintAddress - The mint address of the token.
	 * @returns {Object} - An object containing the name and symbol.
	 */
	async getTokenMetadata(mintAddress) {
		try {
			const mintPublicKey = new PublicKey(mintAddress);

			// Fetch the token metadata using Metaplex
			const nft = await this.metaplex
				.nfts()
				.findByMint({ mintAddress: mintPublicKey });

			return {
				name: nft.name.trim(),
				symbol: nft.symbol.trim(),
			};
		} catch (error) {
			console.error(
				`Error fetching metadata for ${mintAddress}:`,
				error.message
			);
			return { name: "Unknown Token", symbol: "UNKNOWN" };
		}
	}

	/**
	 * Fetches the wallet's SOL balance.
	 * @param {string} walletAddress - The wallet address.
	 * @returns {number} - The SOL balance.
	 */
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

	/**
	 * Fetches the wallet's SPL token accounts, including metadata from Metaplex for unknown tokens.
	 * @param {string} walletAddress - The wallet address.
	 * @returns {Array<Object>} - An array of token objects.
	 */
	async getWalletTokenAccounts(walletAddress) {
		try {
			// Ensure the token list is initialized
			await this.ensureTokenListInitialized();

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

			// Collect mint addresses that are unknown to fetch via Metaplex
			const unknownMintAddresses = [];

			for (const accountInfo of tokenAccounts) {
				const tokenAccountInfo = accountInfo.account.data.parsed.info;
				const mintAddress = tokenAccountInfo.mint;
				const tokenAmountInfo = tokenAccountInfo.tokenAmount;
				const amountRaw = tokenAmountInfo.amount; // Raw amount as string

				// Check if token is in the registry
				const tokenInfo = this.getTokenInfo(mintAddress);

				let decimals;
				let symbol;
				let name;

				if (tokenInfo) {
					decimals = tokenInfo.decimals;
					symbol = tokenInfo.symbol;
					name = tokenInfo.name;
				} else {
					// Token not found in registry; fetch decimals from mint account
					decimals = await this.getTokenDecimals(mintAddress);
					symbol = "UNKNOWN";
					name = "Unknown Token";

					// Collect unknown mint addresses for Metaplex metadata fetching
					unknownMintAddresses.push(mintAddress);
				}

				// Compute the token balance using the raw amount and decimals
				const tokenBalance = parseInt(amountRaw) / Math.pow(10, decimals);

				tokens.push({
					tokenAccount: accountInfo.pubkey,
					mintAddress,
					tokenBalance,
					symbol,
					name,
					decimals,
				});
			}

			// Fetch metadata for unknown tokens using Metaplex
			if (unknownMintAddresses.length > 0) {
				// To optimize, fetch metadata in parallel
				const metadataPromises = unknownMintAddresses.map((mint) =>
					this.getTokenMetadata(mint)
				);
				const metaplexMetadata = await Promise.all(metadataPromises);

				// Update tokens with fetched metadata
				tokens.forEach((token) => {
					if (token.symbol === "UNKNOWN") {
						const index = unknownMintAddresses.indexOf(token.mintAddress);
						if (index !== -1 && metaplexMetadata[index]) {
							token.symbol = metaplexMetadata[index].symbol;
							token.name = metaplexMetadata[index].name;
						}
					}
				});
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
	 * Fetches transactions for a given wallet address with pagination.
	 * @param {string} walletAddress - The wallet address to fetch transactions for.
	 * @param {Object} options - Pagination options.
	 * @param {number} options.limit - Number of transactions to fetch.
	 * @param {string} [options.before] - Signature to paginate before.
	 * @returns {Array} - An array of transaction objects.
	 */
	async getAllTransactions(walletAddress, options = {}) {
		const { limit = 1000, before } = options;

		try {
			const params = {
				limit,
				commitment: "finalized",
			};

			if (before) {
				params.before = before;
			}

			const response = await this.axios.post("", {
				jsonrpc: "2.0",
				id: 1,
				method: "getSignaturesForAddress",
				params: [walletAddress, params],
			});

			const transactions = response.data.result;

			// Convert Unix timestamps to JavaScript Date objects, add as 'date' field
			transactions.forEach((tx) => {
				tx.date = tx.blockTime ? new Date(tx.blockTime * 1000) : null; // Handle cases where blockTime might be null
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
