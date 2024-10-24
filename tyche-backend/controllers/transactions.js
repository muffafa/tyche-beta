import createNetwork from "../web3/index.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import { getCurrentPrices } from "../web3/utils/price.js";
import networkConfig from "../web3/networks/networkConfig.js";

/**
 * @desc    Get detailed information about a specific transaction
 * @route   GET /api/v1/transactions/:txid?network=<network>
 * @access  Public
 */
export const getTransactionDetails = asyncHandler(async (req, res, next) => {
    const { txid } = req.params;
    const { network } = req.query;

    // Validate required parameters
    if (!txid || !network) {
        return next(
            new ErrorResponse("txid and network are required parameters.", 400)
        );
    }

    try {
        // Create network instance and get transaction details
        const networkService = createNetwork(network.toLowerCase());
        const txDetails = await networkService.getTransactionDetails(txid);

        // Handle not found case
        if (!txDetails) {
            return next(
                new ErrorResponse(`Transaction with ID "${txid}" not found.`, 404)
            );
        }

        // Send response
        res.status(200).json({
            success: true,
            data: txDetails
        });
    } catch (error) {
        next(error);
    }
});
