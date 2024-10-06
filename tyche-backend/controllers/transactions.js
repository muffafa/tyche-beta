import createNetwork from "../web3/index.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import { getCurrentPrices } from "../web3/utils/price.js";
import networkConfig from "../web3/networks/networkConfig.js";

/**
 * @desc    Get detailed information about a specific transaction
 * @route   GET /api/v1/transactions/:txid
 * @access  Public
 */
export const getTransactionDetails = asyncHandler(async (req, res, next) => {
	const { txid } = req.params;
	const { network } = req.query;

	if (!txid || !network) {
		return next(
			new ErrorResponse("txid and network are required parameters.", 400)
		);
	}

	const networkLower = network.toLowerCase();
	const config = networkConfig[networkLower];

	if (!config) {
		return next(
			new ErrorResponse(`Network "${network}" is not supported.`, 400)
		);
	}

	try {
		const networkService = createNetwork(networkLower);
		const txDetails = await networkService.getTransactionDetails(txid);

		if (!txDetails) {
			return next(
				new ErrorResponse(`Transaction with ID "${txid}" not found.`, 404)
			);
		}

		// If asset is defined and amount is present, fetch fiat value
		let fiatValues = {};
		if (txDetails.asset && txDetails.amount) {
			const currentPrices = await getCurrentPrices(config.coinGeckoId, [
				"usd",
				"eur",
				"try",
			]);
			fiatValues = {
				USD: {
					amount: txDetails.amount * currentPrices.usd,
					currency: "USD",
				},
				EUR: {
					amount: txDetails.amount * currentPrices.eur,
					currency: "EUR",
				},
				TRY: {
					amount: txDetails.amount * currentPrices.try,
					currency: "TRY",
				},
			};
		}

		res.status(200).json({
			success: true,
			data: {
				transactionId: txDetails.transactionId,
				date: txDetails.date,
				gasFee: txDetails.gasFee,
				from: txDetails.from,
				to: txDetails.to,
				asset: txDetails.asset,
				amount: txDetails.amount,
				value: fiatValues,
			},
		});
	} catch (error) {
		next(error);
	}
});
