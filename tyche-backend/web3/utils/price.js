// web3/utils/price.js
import Axios from "axios";
import dotenv from "dotenv";

/**
 * Fetches the current prices of a given cryptocurrency in specified fiat currencies using CoinGecko API.
 * @param {string} coinId - The CoinGecko ID of the cryptocurrency (e.g., 'solana').
 * @param {Array<string>} vsCurrencies - An array of fiat currency codes (e.g., ['usd', 'eur', 'try']).
 * @returns {Object} - An object containing the current prices in the specified fiat currencies.
 */
export const getCurrentPrices = async (
	coinId,
	vsCurrencies = ["usd", "eur", "try"]
) => {
	try {
		const response = await Axios.get(
			"https://api.coingecko.com/api/v3/simple/price",
			{
				params: {
					ids: coinId,
					vs_currencies: vsCurrencies.join(","),
				},
			}
		);

		const prices = response.data[coinId];
		if (!prices) {
			throw new Error(`Prices for ${coinId} not found.`);
		}

		// Validate that all requested currencies are present
		const missingCurrencies = vsCurrencies.filter(
			(currency) => prices[currency] === undefined
		);
		if (missingCurrencies.length > 0) {
			throw new Error(
				`Prices for currencies [${missingCurrencies.join(", ")}] not found.`
			);
		}

		return prices;
	} catch (error) {
		console.error(`Error fetching prices for ${coinId}:`, error.message);
		throw new Error("Failed to fetch current prices.");
	}
};
