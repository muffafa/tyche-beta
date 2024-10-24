import asyncHandler from "../../middleware/async.js";
import ErrorResponse from "../../utils/errorResponse.js";
import createNetwork from "../../web3/index.js";

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


/**
 * @desc    Get wallet positions
 * @route   GET /api/v1/wallets/ethereum/positions?walletAddress=<address>&filter[positions]=<filterType>
 * @access  Public
 */
export const getWalletPositions = asyncHandler(async (req, res, next) => {
    const { walletAddress } = req.query;
    const queryParams = req.query;

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
        // Create network instance and get wallet positions
        const networkService = createNetwork(network);
        const positionsData = await networkService.getWalletPositions(walletAddress, queryParams);

        // Send response
        res.status(200).json({
            success: true,
            data: positionsData,
        });
    } catch (error) {
        next(error);
    }
});


/**
 * @desc    Get wallet fungible positions
 * @route   GET /api/v1/wallets/ethereum/fungible-positions?walletAddress=<address>&filter[positions]=<filterType>
 * @access  Public
 */
export const getFungiblePositions = asyncHandler(async (req, res, next) => {
    const { walletAddress } = req.query;
    const queryParams = req.query;

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
        // Create network instance and get wallet fungible positions
        const networkService = createNetwork(network);
        const fungiblePositionsData = await networkService.getFungiblePositions(walletAddress, queryParams);

        // Send response
        res.status(200).json({
            success: true,
            data: fungiblePositionsData,
        });
    } catch (error) {
        next(error);
    }
});