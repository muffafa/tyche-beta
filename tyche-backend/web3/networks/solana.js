import BaseNetwork from "./BaseNetwork.js";
import createAxiosInstance from "../utils/axiosInstance.js";
import { TokenListProvider } from "@solana/spl-token-registry";
import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import networkConfig from "./networkConfig.js";
import { getCurrentPrices } from "../utils/price.js";
import { generateCacheKey, getCache, setCache } from "../../utils/cache.js";

class SolanaNetwork extends BaseNetwork {
	constructor(apiKey, heliusApiKey) {
		super(apiKey, heliusApiKey);
		this.apiKey = apiKey;
		this.heliusApiKey = heliusApiKey;
		this.rpcEndpoint = `https://solana-mainnet.g.alchemy.com/v2/${this.apiKey}`;
		this.heliusEndpoint = `https://api.helius.xyz/v0/addresses`;
		this.axios = createAxiosInstance(this.rpcEndpoint);
		this.axiosHelius = createAxiosInstance(this.heliusEndpoint);
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
	 * Retrieves the token metadata for a given mint address from the token list, with caching.
	 * @param {string} mintAddress - The mint address of the token.
	 * @returns {Object|null} - Token metadata or null if not found.
	 */
	async getTokenInfo(mintAddress) {
		// Generate a cache key for the mint address
		const cacheKey = generateCacheKey("tokenInfo", { mintAddress });

		// Try to get the token info from cache
		let tokenInfo = await getCache(cacheKey);
		if (tokenInfo) {
			return tokenInfo;
		}

		// Token info not in cache, proceed to fetch
		tokenInfo = this.tokenList.find((t) => t.address === mintAddress);
		if (tokenInfo) {
			const cachedTokenInfo = {
				symbol: tokenInfo.symbol,
				name: tokenInfo.name,
				decimals: tokenInfo.decimals,
				image: tokenInfo.logoURI,
			};

			// Cache the token info
			await setCache(cacheKey, cachedTokenInfo, "tokenMetadata");

			return cachedTokenInfo;
		} else {
			// Token not found in the registry
			return null;
		}
	}

	/**
	 * Fetches the token decimals from the mint account, with caching.
	 * @param {string} mintAddress - The mint address of the token.
	 * @returns {number} - The decimals of the token.
	 */
	async getTokenDecimals(mintAddress) {
		// Generate a cache key for the decimals
		const cacheKey = generateCacheKey("tokenDecimals", { mintAddress });

		// Try to get the decimals from cache
		let decimals = await getCache(cacheKey);
		if (decimals !== null && decimals !== undefined) {
			return decimals;
		}

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
				decimals = 0;
			} else {
				const data = accountInfo.data[0];
				const buffer = Buffer.from(data, "base64");
				decimals = buffer.readUInt8(44);
			}

			// Cache the decimals
			await setCache(cacheKey, decimals, "tokenMetadata");

			return decimals;
		} catch (error) {
			console.error(`Error fetching mint account for ${mintAddress}:`, error);
			return 0;
		}
	}

	/**
	 * Fetches the token metadata (name, symbol, and image) using Metaplex, with caching.
	 * @param {string} mintAddress - The mint address of the token.
	 * @returns {Object} - An object containing the name, symbol, and image.
	 */
	async getTokenMetadata(mintAddress) {
		// Generate a cache key for the mint address
		const cacheKey = generateCacheKey("tokenMetadata", { mintAddress });

		// Try to get the token metadata from cache
		let metadata = await getCache(cacheKey);
		if (metadata) {
			return metadata;
		}

		// Metadata not in cache, proceed to fetch
		try {
			const mintPublicKey = new PublicKey(mintAddress);

			// Fetch the token metadata using Metaplex
			const nft = await this.metaplex
				.nfts()
				.findByMint({ mintAddress: mintPublicKey });

			// Fetch the URI which contains the JSON metadata
			const uri = nft.uri;

			// Fetch the JSON metadata from the URI
			const response = await fetch(uri);
			const metadataJson = await response.json();

			metadata = {
				name: metadataJson.name ? metadataJson.name.trim() : "Unknown Token",
				symbol: metadataJson.symbol ? metadataJson.symbol.trim() : "UNKNOWN",
				image: metadataJson.image ? metadataJson.image.trim() : null,
			};

			// Cache the metadata
			await setCache(cacheKey, metadata, "tokenMetadata");

			return metadata;
		} catch (error) {
			console.error(
				`Error fetching metadata for ${mintAddress}:`,
				error.message
			);
			return { name: "Unknown Token", symbol: "UNKNOWN", image: null };
		}
	}

	/**
     * Fetches the wallet's SOL balance with fiat equivalents and handles caching.
     * @param {string} walletAddress - The wallet address.
     * @returns {Object} - Wallet balance data with fiat equivalents.
     */
    async getWalletBalance(walletAddress) {
        // Generate cache key for this specific wallet and network
        const cacheKey = generateCacheKey("walletBalance", {
            walletAddress,
            network: "solana"
        });

        // Try to get balance from cache
        const cachedBalance = await getCache(cacheKey);
        if (cachedBalance) {
            return {
                ...cachedBalance,
                cached: true
            };
        }

        try {
            // Fetch raw SOL balance
            const response = await this.axios.post("", {
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [walletAddress],
            });

            const balanceLamports = response.data.result.value;
            const balanceSOL = balanceLamports / 1e9; // Convert lamports to SOL

            // Fetch current prices for fiat equivalents
            const currentPrices = await getCurrentPrices(
                networkConfig.solana.coinGeckoId,
                ["usd", "eur", "try"]
            );

            // Calculate fiat equivalents
            const balanceData = {
                walletAddress,
                network: "solana",
                balance: {
                    amount: balanceSOL,
                    symbol: networkConfig.solana.symbol,
                },
                equivalents: {
                    USD: {
                        amount: balanceSOL * currentPrices.usd,
                        currency: "USD",
                    },
                    EUR: {
                        amount: balanceSOL * currentPrices.eur,
                        currency: "EUR",
                    },
                    TRY: {
                        amount: balanceSOL * currentPrices.try,
                        currency: "TRY",
                    },
                },
                cached: false
            };

            // Cache the balance data
            await setCache(cacheKey, balanceData, "walletBalance");

            return balanceData;
        } catch (error) {
            console.error("Error fetching Solana wallet balance:", error);
            throw error;
        }
    }

	/**
	 * Fetches the wallet's SPL token accounts, utilizing cached metadata for each mint address.
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
					{ programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
					{ encoding: "jsonParsed" },
				],
			});

			const tokenAccounts = response.data.result.value;
			const tokens = [];

			for (const accountInfo of tokenAccounts) {
				const tokenAccountInfo = accountInfo.account.data.parsed.info;
				const mintAddress = tokenAccountInfo.mint;
				const tokenAmountInfo = tokenAccountInfo.tokenAmount;
				const amountRaw = tokenAmountInfo.amount;

				// Generate cache keys
				const metadataCacheKey = generateCacheKey("tokenMetadata", {
					mintAddress,
				});
				const decimalsCacheKey = generateCacheKey("tokenDecimals", {
					mintAddress,
				});

				// Try to get token metadata and decimals from cache
				let tokenMetadata = await getCache(metadataCacheKey);
				let decimals = await getCache(decimalsCacheKey);

				// If metadata is not cached, fetch and cache it
				if (!tokenMetadata) {
					// Check if token is in the registry
					tokenMetadata = await this.getTokenInfo(mintAddress);

					if (!tokenMetadata) {
						// Token not in registry, get metadata via Metaplex
						tokenMetadata = await this.getTokenMetadata(mintAddress);
					}

					// Cache the token metadata
					await setCache(metadataCacheKey, tokenMetadata, "tokenMetadata");
				}

				// If decimals are not cached, fetch and cache them
				if (decimals === null || decimals === undefined) {
					decimals = await this.getTokenDecimals(mintAddress);
					await setCache(decimalsCacheKey, decimals, "tokenMetadata");
				}

				const { symbol, name, image } = tokenMetadata;

				// Compute the token balance using the raw amount and decimals
				const tokenBalance = parseInt(amountRaw) / Math.pow(10, decimals);

				tokens.push({
					tokenAccount: accountInfo.pubkey,
					mintAddress,
					tokenBalance,
					symbol,
					name,
					decimals,
					image,
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
     * Fetches and processes detailed transaction information including fiat values
     * @param {string} txid - The transaction ID
     * @returns {Object} - Processed transaction details with fiat values
     */
    async getTransactionDetails(txid) {
        try {
            // Get raw transaction details
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
                return null;
            }

            // Process basic transaction details
            const date = tx.blockTime ? new Date(tx.blockTime * 1000) : null;
            const feeLamports = tx.meta?.fee || 0;
            const feeSOL = feeLamports / 1e9;

            // Extract transaction data
            const instructions = tx.transaction.message.instructions;
            const accountKeys = tx.transaction.message.accountKeys;
            const preBalances = tx.meta.preBalances;
            const postBalances = tx.meta.postBalances;

            // Process transaction participants and amounts
            const from = accountKeys[0];
            const lamportsSpent = preBalances[0] - postBalances[0];
            const amount = lamportsSpent / 1e9;
            const asset = "SOL";

            // Find recipient from instruction data
            let to = null;
            for (const instruction of instructions) {
                if (instruction.parsed && instruction.parsed.type === "create") {
                    to = instruction.parsed.info.wallet;
                    break;
                }
            }

            // Get current prices for fiat value calculation
            const prices = await getCurrentPrices(networkConfig.solana.coinGeckoId, [
                "usd",
                "eur",
                "try"
            ]);

            // Calculate fiat values
            const fiatValues = {
                USD: amount * prices.usd,
                EUR: amount * prices.eur,
                TRY: amount * prices.try
            };

            // Return processed transaction details
            return {
                transactionId: txid,
                date,
                gasFee: {
                    lamports: feeLamports,
                    sol: feeSOL
                },
                from,
                to,
                asset,
                amount,
                fiatValues
            };
        } catch (error) {
            console.error("Error fetching Solana transaction details:", error);
            throw error;
        }
    }

	/**
	 * Fetches and parses transactions for a given wallet address from Helius,
	 * including fiat equivalents for native transfer amounts.
	 * @param {string} address - The wallet address.
	 * @param {string} [type] - The type of transactions to filter (optional).
	 * @returns {Array<Object>} - An array of parsed transaction objects with fiat equivalents.
	 */
	async getTransactionsFromHelius(address, type) {
		let url = `/${address}/transactions?api-key=${this.heliusApiKey}`;
		if (type) {
			url += `&type=${type}`;
		}
		try {
			const response = await this.axiosHelius.get(url);
			const data = response.data;

			// Fetch current prices for SOL in USD, EUR, and TRY
			let prices;
			try {
				prices = await getCurrentPrices(networkConfig.solana.coinGeckoId, [
					"usd",
					"eur",
					"try",
				]);
			} catch (priceError) {
				console.error("Error fetching current SOL prices:", priceError);
				// Fallback to zero equivalents if price fetching fails
				prices = { usd: 0, eur: 0, try: 0 };
			}

			// Parse the transactions
			const parsedData = data.map((tx) => ({
				description: tx.description,
				type: tx.type,
				source: tx.source,
				fee: tx.fee,
				feePayer: tx.feePayer,
				signature: tx.signature,
				timestamp: new Date(tx.timestamp * 1000),
				nativeTransfers: (tx.nativeTransfers || []).map((transfer) => {
					const solAmount = (transfer.amount || 0) / 1_000_000_000; // Convert lamports to SOL
					return {
						from: transfer.fromUserAccount,
						to: transfer.toUserAccount,
						amount: {
							amount: solAmount,
							symbol: "SOL",
							equivalents: {
								USD: parseFloat((solAmount * prices.usd).toFixed(2)),
								EUR: parseFloat((solAmount * prices.eur).toFixed(2)),
								TRY: parseFloat((solAmount * prices.try).toFixed(2)),
							},
						},
					};
				}),
				tokenTransfers: (tx.tokenTransfers || []).map((transfer) => ({
					from: transfer.fromUserAccount,
					to: transfer.toUserAccount,
					fromTokenAccount: transfer.fromTokenAccount,
					toTokenAccount: transfer.toTokenAccount,
					tokenAmount: transfer.tokenAmount || 0,
					mint: transfer.mint,
				})),
				transactionError: tx.transactionError || null,
				events: {
					nft: tx.events?.nft
						? {
								description: tx.events.nft.description,
								type: tx.events.nft.type,
								source: tx.events.nft.source,
								amount: tx.events.nft.amount,
								fee: tx.events.nft.fee,
								buyer: tx.events.nft.buyer,
								seller: tx.events.nft.seller,
								nfts: (tx.events.nft.nfts || []).map((nft) => ({
									mint: nft.mint,
									tokenStandard: nft.tokenStandard,
								})),
						  }
						: null,
					swap: tx.events?.swap
						? {
								nativeInput: tx.events.swap.nativeInput || {},
								nativeOutput: tx.events.swap.nativeOutput || {},
								tokenInputs: (tx.events.swap.tokenInputs || []).map(
									(input) => ({
										userAccount: input.userAccount,
										tokenAccount: input.tokenAccount,
										mint: input.mint,
										tokenAmount: input.rawTokenAmount.tokenAmount,
									})
								),
								tokenOutputs: (tx.events.swap.tokenOutputs || []).map(
									(output) => ({
										userAccount: output.userAccount,
										tokenAccount: output.tokenAccount,
										mint: output.mint,
										tokenAmount: output.rawTokenAmount.tokenAmount,
									})
								),
								tokenFees: (tx.events.swap.tokenFees || []).map((fee) => ({
									userAccount: fee.userAccount,
									tokenAccount: fee.tokenAccount,
									mint: fee.mint,
									tokenAmount: fee.rawTokenAmount.tokenAmount,
								})),
								nativeFees: (tx.events.swap.nativeFees || []).map((fee) => ({
									account: fee.account,
									amount: fee.amount,
								})),
								innerSwaps: (tx.events.swap.innerSwaps || []).map(
									(innerSwap) => ({
										tokenInputs: innerSwap.tokenInputs,
										tokenOutputs: innerSwap.tokenOutputs,
										tokenFees: innerSwap.tokenFees,
										nativeFees: innerSwap.nativeFees,
										programInfo: innerSwap.programInfo,
									})
								),
						  }
						: null,
					compressed: tx.events?.compressed || null,
					setAuthority: tx.events?.setAuthority || null,
				},
			}));

			return parsedData;
		} catch (error) {
			console.error("Error fetching transactions:", error);
			throw error;
		}
	}
}

export default SolanaNetwork;
