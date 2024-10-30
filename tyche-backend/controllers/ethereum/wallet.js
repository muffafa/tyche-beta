import asyncHandler from "../../middleware/async.js";
import ErrorResponse from "../../utils/errorResponse.js";
import createNetwork from "../../web3/index.js";

const network = 'ethereum'

/**
 * @desc    Get wallet transactions
 * @route   GET /api/v1/wallets/ethereum/transactions?walletAddress=<address>&chain_id=<chain_id>
 * @access  Public
 */
export const getWalletTransactions = asyncHandler(async (req, res, next) => {
    const { walletAddress, chain_id } = req.query

    // Validate required parameter
    if (!walletAddress) {
        return next(
            new ErrorResponse(
                "walletAddress is a required parameter.",
                400
            )
        );
    }

    if (!chain_id) {
        return next(
            new ErrorResponse(
                "chain_id is a required parameter.",
                400
            )
        );
    }

    try {
        // Create network instance and get wallet balance
        const networkService = createNetwork(network);
        const transactionsData = await networkService.getWalletTransactions(walletAddress, chain_id);

        // Send response
        res.status(200).json({
            success: true,
            data: transactionsData
        });
    } catch (error) {
        next(error);
    }
});


/**
 * @desc    Get wallet positions
 * @route   GET /api/v1/wallets/ethereum/positions?walletAddress=<address>&filter[positions]=<filterType>&chain_id=<chain_id>
 * @access  Public
 */
export const getWalletPositions = asyncHandler(async (req, res, next) => {
    const { walletAddress, chain_id } = req.query;
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

    if (!chain_id) {
        return next(
            new ErrorResponse(
                "chain_id is a required parameter.",
                400
            )
        );
    }

    try {
        // Create network instance and get wallet positions
        const networkService = createNetwork(network);
        const positionsData = await networkService.getWalletPositions(walletAddress, chain_id, queryParams);

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
 * @route   GET /api/v1/wallets/ethereum/nonfungible-positions?walletAddress=<address>&filter[positions]=<filterType>&chain_id=<chain_id>
 * @access  Public
 */
export const getNonFungiblePositions = asyncHandler(async (req, res, next) => {
    const { walletAddress, chain_id } = req.query;
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

    if (!chain_id) {
        return next(
            new ErrorResponse(
                "chain_id is a required parameter.",
                400
            )
        );
    }

    try {
        // Create network instance and get wallet fungible positions
        const networkService = createNetwork(network);
        const nonFungiblePositionsData = await networkService.getNonFungiblePositions(walletAddress, chain_id, queryParams);

        // Send response
        res.status(200).json({
            success: true,
            data: nonFungiblePositionsData,
        });
    } catch (error) {
        next(error);
    }
});