import Axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../../.env" });

/**
 * Fetches the current price of a given cryptocurrency in USD using CoinGecko API.
 * @param {string} coinId - The CoinGecko ID of the cryptocurrency (e.g., 'solana').
 * @returns {number} - The current price in USD.
 */
export const getCurrentPriceUSD = async (coinId) => {
	try {
		const response = await Axios.get(
			"https://api.coingecko.com/api/v3/simple/price",
			{
				params: {
					ids: coinId,
					vs_currencies: "usd",
				},
			}
		);

		const price = response.data[coinId]?.usd;
		if (price === undefined) {
			throw new Error(`Price for ${coinId} not found.`);
		}

		return price;
	} catch (error) {
		console.error(`Error fetching price for ${coinId}:`, error.message);
		throw new Error("Failed to fetch current price.");
	}
};
