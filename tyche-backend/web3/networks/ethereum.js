import BaseNetwork from "./BaseNetwork.js";
import createAxiosInstance from "../utils/axiosInstance.js";
import networkConfig from "./networkConfig.js";
import { getCurrentPrices } from "../utils/price.js";
import { generateCacheKey, getCache, setCache } from "../../utils/cache.js";

class EthereumNetwork extends BaseNetwork {
	constructor(apiKey) {
		super(apiKey);
		this.apiKey = apiKey;
		this.baseURL = "https://api.zerion.io";
		this.axios = createAxiosInstance(this.baseURL);
		this.currency = "usd"; // Default currency
	}

	/**
	 * Fetches the wallet's transactions including balance and token holdings.
	 * @param {string} walletAddress - The Ethereum wallet address.
	 * @param {string} chain_id - The chain ID, e.g., 'ethereum' for Ethereum mainnet.
	 * @returns {Object} - Transactions details.
	 */
	async getWalletTransactions(walletAddress, chain_id) {
		const cacheKey = generateCacheKey('walletTransactions', { walletAddress, chain_id, currency: this.currency });
		const cachedData = await getCache(cacheKey);

		if (cachedData) {
			console.log('Cache hit for wallet transactions');
			return cachedData;
		}

		const parseResponseData = (response) => {
			if (!response.data.data || !Array.isArray(response.data.data)) {
				console.error('Invalid data formatt');
				return { data: [] };
			}

			return {
				data: Object.values(response.data.data).map(transaction => ({
					//type: transaction.type || 'Unknown',
					attributes: {
						operation_type: transaction.attributes?.operation_type || '',
						hash: transaction.attributes?.hash || '',
						mined_at: transaction.attributes?.mined_at || '',
						sent_from: transaction.attributes?.sent_from || '',
						sent_to: transaction.attributes?.sent_to || '',
						status: transaction.attributes?.status || '',
						nonce: transaction.attributes?.nonce || '',
						fee: {
							fungible_info: {
								name: transaction.attributes?.fee?.fungible_info?.name || '',
								symbol: transaction.attributes?.fee?.fungible_info?.symbol || '',
								icon: transaction.attributes?.fee?.fungible_info?.icon || {},
								flags: transaction.attributes?.fee?.fungible_info?.flags || {}
							},
							quantity: {
								decimals: transaction.attributes?.fee?.quantity?.decimals || 0,
								float: parseFloat(transaction.attributes?.fee?.quantity?.numeric) || 0
							},
							price: transaction.attributes?.fee?.price || 0,
							value: transaction.attributes?.fee?.value || 0
						},
						transfers: transaction.attributes?.transfers?.map(transfer => ({
							fungible_info: {
								name: transfer.fungible_info?.name || '',
								symbol: transfer.fungible_info?.symbol || '',
								icon: transfer.fungible_info?.icon?.url || '',
								flags: transfer.fungible_info?.flags || {},
							},
							direction: transfer.direction || '',
							quantity: {
								decimals: transfer.quantity?.decimals || 0,
								float: parseFloat(transfer.quantity?.numeric) || parseFloat(transfer.quantity?.float) || 0
							},
							value: transfer.value || null,
							price: transfer.price || null,
							sender: transfer.sender || '',
							recipient: transfer.recipient || ''
						})) || [],
						approvals: transaction.attributes?.approvals || [],
						application_metadata: transaction.attributes?.application_metadata || {},
						flags: transaction.attributes?.flags || {}
					}
				}))
			}
		};

		try {
			const response = await this.axios.get(
				`/v1/wallets/${walletAddress}/transactions`,
				{
					params: {
						currency: this.currency,
						"filter[chain_ids]": chain_id, // Chain ID, e.g., 'ethereum' for Ethereum mainnet
						"filter[trash]": "only_non_trash",
					},
					headers: {
						accept: "application/json",
						authorization: `Basic ${this.apiKey}`,
					},
				}
			);

			const transactions = parseResponseData(response);

			// Cache the data for future use
			await setCache(cacheKey, transactions, 'walletTransactions');

			return {
				transactions,
			};
		} catch (error) {
			console.error(
				"Error fetching Ethereum wallet transactions:",
				error.response?.data || error.message
			);
			throw error;
		}
	}

	/**
		 * Fetches the wallet's positions including DeFi and simple wallet positions.
		 * @param {string} walletAddress - The Ethereum wallet address.
		 * @param {string} chain_id - The chain ID, e.g., 'ethereum' for Ethereum mainnet.
		 * @param {Object} [params] - Optional query parameters for filtering results.
		 * @returns {Object} - Positions details.
		 */
	async getWalletPositions(walletAddress, chain_id, params = {}) {
		const cacheKey = generateCacheKey('walletPositions', { walletAddress, chain_id, params: JSON.stringify(params), currency: this.currency });
		const cachedData = await getCache(cacheKey);

		if (cachedData) {
			console.log('Cache hit for wallet positions');
			return cachedData;
		}

		const parseResponseData = (responseData) => {
			if (!responseData.data.data || !Array.isArray(responseData.data.data)) {
				console.error('Invalid data formatt');
				return { data: [] };
			}

			return {
				data: responseData.data.data.map(item => ({
					attributes: {
						quantity: {
							decimals: item.attributes.quantity.decimals,
							float: item.attributes.quantity.float
						},
						value: item.attributes.value,
						price: item.attributes.price,
						changes: item.attributes.changes,
						fungible_info: {
							name: item.attributes.fungible_info.name,
							symbol: item.attributes.fungible_info.symbol,
							icon: {
								url: item.attributes.fungible_info.icon?.url || ''
							},
							flags: {
								verified: item.attributes.fungible_info.flags.verified
							}
						}
					}
				}))
			}
		};

		try {
			let response;
			let retries = 5; // Limit the number of retries to avoid infinite loop

			do {
				response = await this.axios.get(
					`/v1/wallets/${walletAddress}/positions`,
					{
						params: {
							currency: this.currency,
							"filter[positions]": "only_simple",
							"filter[chain_ids]": chain_id, // Chain ID, e.g., 'ethereum' for Ethereum mainnet
							"filter[trash]": "only_non_trash",
							...params
						},
						headers: {
							accept: "application/json",
							authorization: `Basic ${this.apiKey}`,
						},
					}
				);

				// If the status is 202, we wait for the data to be prepared
				if (response.status === 202) {
					console.warn("Positions not ready yet, retrying...");
					await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for 3 seconds before retrying
					retries--;
				} else if (response.status === 200) {
					// Cache the data for future use
					const parsedData = parseResponseData(response);
					await setCache(cacheKey, parsedData, 'walletPositions');
					return parsedData;
				} else {
					throw new Error(`Unexpected response status: ${response.status}`);
				}
			} while (retries > 0);

			throw new Error("Failed to fetch wallet positions within the retry limit.");
		} catch (error) {
			console.error(
				"Error fetching Ethereum wallet positions:",
				error.response?.data || error.message
			);
			throw error;
		}
	}

	/**
	 * Fetches the wallet's fungible positions.
	 * @param {string} walletAddress - The Ethereum wallet address.
	 * @param {string} chain_id - The chain ID, e.g., 'ethereum' for Ethereum mainnet.
	 * @param {Object} [params] - Optional query parameters for filtering results.
	 * @returns {Object} - Non Fungible positions details.
	 */
	async getNonFungiblePositions(walletAddress, chain_id, params = {}) {
		const cacheKey = generateCacheKey('nonFungiblePositions', { walletAddress, chain_id, params: JSON.stringify(params), currency: this.currency });
		const cachedData = await getCache(cacheKey);

		if (cachedData) {
			console.log('Cache hit for non fungible positions');
			return cachedData;
		}

		const headers = {
			accept: "application/json",
			authorization: `Basic ${this.apiKey}`,
		};

		const parseResponseData = (responseData) => {
			if (!responseData.data.data || !Array.isArray(responseData.data.data)) {
				console.error('Invalid data format');
				return { data: [] };
			}

			return {
				data: responseData.data.data.map(item => ({
					attributes: {
						nfts_count: item.attributes.nfts_count,
						total_floor_price: item.attributes.total_floor_price,
						collection_info: {
							name: item.attributes.collection_info.name,
							description: item.attributes.collection_info.description,
							content: {
								icon: {
									url: item.attributes.collection_info.content.icon.url
								},
								banner: item.attributes.collection_info.content.banner
									? { url: item.attributes.collection_info.content.banner.url }
									: {}
							}
						}
					}
				}))
			};
		};

		try {
			let response;
			let retries = 5; // Limit the number of retries
			const retryInterval = 3000; // Wait time between retries

			const startTime = Date.now();
			do {
				response = await this.axios.get(
					`/v1/wallets/${walletAddress}/nft-collections`,
					{
						params: {
							currency: this.currency,
							"filter[chain_ids]": chain_id, // Chain ID, e.g., 'ethereum' for Ethereum mainnet
							...params,
						},
						headers: headers,
					}
				);

				if (response.status === 202) {
					console.warn("Positions not ready yet, retrying...");
					await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Wait before retrying
					retries--;
				} else if (response.status === 200) {
					// Cache the data
					const parsedData = parseResponseData(response);
					await setCache(cacheKey, parsedData, 'nonFungiblePositions');
					return parsedData;
				} else {
					throw new Error(`Unexpected response status: ${response.status}`);
				}
			} while (retries > 0);

			throw new Error("Failed to fetch non fungible positions within the retry limit.");
		} catch (error) {
			console.error(
				"Error fetching Ethereum non-fungible positions:",
				error.response?.data || error.message
			);
			throw error;
		}
	}

}

export default EthereumNetwork;
