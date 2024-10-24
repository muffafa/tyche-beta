import asyncHandler from "../../middleware/async.js";
import ErrorResponse from "../../utils/errorResponse.js";
import {
    getCache,
	setCache,
	deleteCache,
	generateCacheKey,
} from "../../utils/cache.js";
import createNetwork from "../../web3/index.js";
import networkConfig from "../../web3/networks/networkConfig.js";

const network = 'ethereum'

/**
 * @desc    Get wallet portfolio
 * @route   GET /api/v1/wallets/ethereum/portfolio?walletAddress=<address>
 * @access  Public
 */
export const getWalletPortfolio = asyncHandler(async (req, res, next) => {
    const { walletAddress } = req.query

    // Validate required parameter
    if (!walletAddress) {
        return next(
            new ErrorResponse(
                "walletAddress is a required parameter.",
                400
            )
        );
    }

    try {
        // Create network instance and get wallet balance
        const networkService = createNetwork(network);
        const portfolioData = await networkService.getWalletPortfolio(walletAddress);

        // Send response
        res.status(200).json({
            success: true,
            data: portfolioData
        });
    } catch (error) {
        next(error);
    }
});