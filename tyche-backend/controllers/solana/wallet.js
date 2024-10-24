import asyncHandler from "../../middleware/async.js";
import ErrorResponse from "../../utils/errorResponse.js";
import {
    getCache,
	setCache,
	deleteCache,
	generateCacheKey,
} from "../../utils/cache.js";
import createNetwork from "../../web3/index.js";
import { getCurrentPrices } from "../../web3/utils/price.js";
import networkConfig from "../../web3/networks/networkConfig.js";

const network = 'solana'

/**
 * @desc    Get wallet balance with USD, EUR, and TRY equivalents
 * @route   GET /api/v1/wallets/solana/balance?walletAddress=<address>
 * @access  Public
 */
export const getWalletBalance = asyncHandler(async (req, res, next) => {
    const { walletAddress } = req.query;

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
        const networkService = createNetwork("solana");
        const balanceData = await networkService.getWalletBalance(walletAddress);

        // Send response
        res.status(200).json({
            success: true,
            data: balanceData
        });
    } catch (error) {
        next(error);
    }
});


// @desc    Get wallet token accounts
// @route   GET /api/v1/wallets/solana/tokens
// @access  Public
export const getWalletTokenAccounts = asyncHandler(async (req, res, next) => {
	const { walletAddress } = req.query;

	if (!walletAddress || !network) {
		return next(
			new ErrorResponse(
				"walletAddress and network are required parameters.",
				400
			)
		);
	}

	// Attempt to retrieve from cache
	const cacheKey = generateCacheKey("walletTokens", {
		walletAddress,
		network,
	});

	const cachedTokens = await getCache(cacheKey);

	if (cachedTokens) {
		return res.status(200).json({
			success: true,
			data: cachedTokens,
			cached: true, // Indicate that data was served from cache
		});
	}

	try {
		const networkService = createNetwork(network);
		const tokens = await networkService.getWalletTokenAccounts(walletAddress);

		// Set cache with specific category TTL
		await setCache(cacheKey, tokens, "walletTokens");

		res.status(200).json({
			success: true,
			data: {
				walletAddress,
				network,
				tokens,
			},
            cached: false, // Data freshly fetched from the API
		});
	} catch (error) {
		next(error);
	}
});


/**
 * @desc    Get wallet transactions
 * @route   GET /api/v1/wallets/solana/transactions
 * @access  Public
 */
export const getWalletTransactions = asyncHandler(async (req, res, next) => {
	const { walletAddress, type } = req.query;

	if (!walletAddress || !network) {
		return next(
			new ErrorResponse(
				"walletAddress and network are required parameters.",
				400
			)
		);
	}

	const networkLower = network.toLowerCase();
	const config = networkConfig[networkLower];

	if (!config) {
		return next(
			new ErrorResponse(`Network "${network}" is not supported.`, 400)
		);
	}

	const validTypes = [
		"NFT_BID",
		"NFT_SALE",
		"NFT_MINT",
		"TRANSFER",
		"DEPOSIT",
		"WITHDRAW",
		"SWAP",
		"STAKE",
		"UNSTAKE",
		"CLAIM_REWARDS",
		"LOAN",
		"REPAY_LOAN",
		"BORROW_SOL_FOR_NFT",
		"CLAIM_NFT",
		"REBORROW_SOL_FOR_NFT",
		"FORECLOSE_LOAN",
		"CANCEL_LOAN_REQUEST",
		"CREATE_ORDER",
		"CANCEL_ORDER",
		"FILL_ORDER",
	];

	if (type && !validTypes.includes(type)) {
		return next(new ErrorResponse(`Invalid transaction type "${type}".`, 400));
	}

	// Attempt to retrieve from cache
	const cacheKey = generateCacheKey("walletTransactions", {
		walletAddress,
		network: networkLower,
		type,
	});

	const cachedTransactions = await getCache(cacheKey);

	if (cachedTransactions) {
		return res.status(200).json({
			success: true,
			data: cachedTransactions,
			cached: true, // Indicate that data was served from cache
		});
	}

	try {
		const networkService = createNetwork(networkLower);

		// Fetch parsed transactions directly
		const parsedTransactions = await networkService.getTransactionsFromHelius(
			walletAddress,
			type // Optional
		);

		// Set cache with specific category TTL
		await setCache(cacheKey, parsedTransactions, "walletTransactions");

		// Return the parsed transactions
		res.status(200).json({
			success: true,
			data: parsedTransactions,
			cached: false, // Data freshly fetched from the API
		});
	} catch (error) {
		next(error);
	}
});