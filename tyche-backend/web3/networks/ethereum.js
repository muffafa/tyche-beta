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
		try {
			const response = await this.axios.get(
				`/v1/wallets/${walletAddress}/portfolio`,
				{
					params: { currency: this.currency },
					headers: {
						accept: "application/json",
						authorization: `Bearer ${this.apiKey}`,
					},
				}
			);

			const portfolio = response.data;

			console.log(`Portfolio: ${portfolio}`);

			return {
				totalBalance: portfolio.total_value,
				currency: this.currency,
				tokens: portfolio.tokens.map((token) => ({
					address: token.asset.address,
					symbol: token.asset.symbol,
					name: token.asset.name,
					balance: token.quantity,
					balanceUSD: token.value,
					image: token.asset.image_url,
				})),
			};
		} catch (error) {
			console.error(
				"Error fetching Ethereum wallet balance:",
				error.response?.data || error.message
			);
			throw error;
		}
	}
}

export default EthereumNetwork;
