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
	 * Fetches the wallet's portfolio including balance and token holdings.
	 * @param {string} walletAddress - The Ethereum wallet address.
	 * @returns {Object} - Portfolio details.
	 */
	async getWalletPortfolio(walletAddress) {
		const cacheKey = generateCacheKey('walletPortfolio', { walletAddress, currency: this.currency });
		const cachedData = await getCache(cacheKey);

		if (cachedData) {
			console.log('Cache hit for wallet portfolio');
			return cachedData;
		}

		try {
			const response = await this.axios.get(
				`/v1/wallets/${walletAddress}/portfolio`,
				{
					params: { currency: this.currency },
					headers: {
						accept: "application/json",
						authorization: `Basic ${this.apiKey}`,
					},
				}
			);

			const portfolio = response.data.data;

			// Cache the data for future use
			await setCache(cacheKey, portfolio, 'walletPortfolio');

			return {
				...portfolio,
			};
		} catch (error) {
			console.error(
				"Error fetching Ethereum wallet balance:",
				error.response?.data || error.message
			);
			throw error;
		}
	}

	/**
		 * Fetches the wallet's positions including DeFi and simple wallet positions.
		 * @param {string} walletAddress - The Ethereum wallet address.
		 * @param {Object} [params] - Optional query parameters for filtering results.
		 * @returns {Object} - Positions details.
		 */
	async getWalletPositions(walletAddress, params = {}) {
		const cacheKey = generateCacheKey('walletPositions', { walletAddress, params: JSON.stringify(params), currency: this.currency });
		const cachedData = await getCache(cacheKey);

		if (cachedData) {
			console.log('Cache hit for wallet positions');
			return cachedData;
		}

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
					await setCache(cacheKey, response.data.data, 'walletPositions');
					return response.data.data;
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
	 * @param {Object} [params] - Optional query parameters for filtering results.
	 * @returns {Object} - Fungible positions details.
	 */
	async getFungiblePositions(walletAddress, params = {}) {
		const cacheKey = generateCacheKey('fungiblePositions', { walletAddress, params: JSON.stringify(params), currency: this.currency });
		const cachedData = await getCache(cacheKey);

		if (cachedData) {
			console.log('Cache hit for fungible positions');
			return cachedData;
		}

		const headers = {
			accept: "application/json",
			authorization: `Basic ${this.apiKey}`,
		};

		try {
			let response;
			let retries = 5; // Limit the number of retries
			const retryInterval = 3000; // Wait time between retries

			const startTime = Date.now();
			do {
				response = await this.axios.get(
					`/v1/wallets/${walletAddress}/positions`,
					{
						params: {
							currency: this.currency,
							"filter[positions]": "only_simple", // Default filter for simple wallet positions
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
					await setCache(cacheKey, response.data.data, 'fungiblePositions');
					return response.data.data;
				} else {
					throw new Error(`Unexpected response status: ${response.status}`);
				}
			} while (retries > 0);

			throw new Error("Failed to fetch fungible positions within the retry limit.");
		} catch (error) {
			console.error(
				"Error fetching Ethereum fungible positions:",
				error.response?.data || error.message
			);
			throw error;
		}
	}

}

export default EthereumNetwork;
