import Wallet from "../models/Wallet.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import {
	getCache,
	setCache,
	deleteCache,
	generateCacheKey,
} from "../utils/cache.js";
import Web3 from "web3";

// Initialize Web3 (optional, if you need to interact with blockchain)
const web3 = new Web3();

// Supported networks for validation purposes
const SUPPORTED_NETWORKS = [
	"Ethereum",
	"Solana",
	"Binance Smart Chain",
	"Polygon",
	"Other",
];

// @desc    Add new wallet
// @route   POST /api/v1/wallets
// @access  Private
export const addWallet = asyncHandler(async (req, res, next) => {
	const { address, network, nickname } = req.body;

	if (!address || !network) {
		return next(
			new ErrorResponse("Please provide wallet address and network", 400)
		);
	}

	// Validate network
	if (!SUPPORTED_NETWORKS.includes(network)) {
		return next(
			new ErrorResponse(
				`Unsupported network. Supported networks are: ${SUPPORTED_NETWORKS.join(
					", "
				)}`,
				400
			)
		);
	}

	// Validate wallet address based on network
	let isValidAddress = false;
	switch (network) {
		case "Ethereum":
		case "Binance Smart Chain":
		case "Polygon":
			isValidAddress = web3.utils.isAddress(address);
			break;
		case "Solana":
			// Basic Solana address validation; consider using a library for robust validation
			isValidAddress = /^([1-9A-HJ-NP-Za-km-z]{32,44})$/.test(address);
			break;
		default:
			// For 'Other' networks, skip specific validation or implement as needed
			isValidAddress = true;
	}

	if (!isValidAddress) {
		return next(
			new ErrorResponse("Invalid wallet address for the specified network", 400)
		);
	}

	// Check if wallet already exists for this user
	const existingWallet = await Wallet.findOne({ address: address });

	if (existingWallet && existingWallet.user.toString() === req.user.id) {
		return next(new ErrorResponse("Wallet already added", 400));
	}

	// Create wallet
	const wallet = await Wallet.create({
		address, // Encryption handled by mongoose-encryption
		network,
		nickname,
		user: req.user.id,
	});

	// Add wallet to user's wallets array
	req.user.wallets.push(wallet._id);
	await req.user.save();

	// Invalidate the user's wallets cache
	const walletCacheKey = generateCacheKey("userWallets", {
		userId: req.user.id,
	});
	const profileCacheKey = generateCacheKey("userProfile", {
		userId: req.user.id,
	});
	await deleteCache(walletCacheKey);
	await deleteCache(profileCacheKey);

	res.status(201).json({
		success: true,
		data: {
			_id: wallet._id,
			address: wallet.address, // Decrypted automatically by mongoose-encryption
			network: wallet.network,
			nickname: wallet.nickname,
			addedAt: wallet.addedAt,
		},
	});
});

// @desc    Get all wallets for logged in user
// @route   GET /api/v1/wallets
// @access  Private
export const getWallets = asyncHandler(async (req, res, next) => {
	const userId = req.user.id;

	// Generate a unique cache key for the user's wallets
	const cacheKey = generateCacheKey("userWallets", { userId });

	// Attempt to retrieve wallets from cache
	const cachedWallets = await getCache(cacheKey);
	if (cachedWallets) {
		return res.status(200).json({
			success: true,
			count: cachedWallets.length,
			data: cachedWallets,
			cached: true,
		});
	}

	try {
		// Fetch wallets from the database
		const wallets = await Wallet.find({ user: userId }).select("-__v");

		// Set the wallets data in the cache
		await setCache(cacheKey, wallets, "userWallets");

		res.status(200).json({
			success: true,
			count: wallets.length,
			data: wallets,
			cached: false,
		});
	} catch (error) {
		next(error);
	}
});

// @desc    Update a wallet's nickname
// @route   PUT /api/v1/wallets/:id
// @access  Private
export const updateWallet = asyncHandler(async (req, res, next) => {
	const { nickname } = req.body;

	if (!nickname) {
		return next(new ErrorResponse("Please provide a nickname", 400));
	}

	let wallet = await Wallet.findById(req.params.id);

	if (!wallet) {
		return next(
			new ErrorResponse(`Wallet not found with id of ${req.params.id}`, 404)
		);
	}

	// Ensure user owns the wallet
	if (wallet.user.toString() !== req.user.id) {
		return next(new ErrorResponse("Not authorized to update this wallet", 401));
	}

	wallet.nickname = nickname;
	await wallet.save();

	// Invalidate the user's wallets cache
	const walletCacheKey = generateCacheKey("userWallets", {
		userId: req.user.id,
	});
	const profileCacheKey = generateCacheKey("userProfile", {
		userId: req.user.id,
	});
	await deleteCache(walletCacheKey);
	await deleteCache(profileCacheKey);

	res.status(200).json({
		success: true,
		data: wallet,
	});
});

// @desc    Delete a wallet
// @route   DELETE /api/v1/wallets/:id
// @access  Private
export const deleteWallet = asyncHandler(async (req, res, next) => {
	const wallet = await Wallet.findById(req.params.id);

	if (!wallet) {
		return next(
			new ErrorResponse(`Wallet not found with id of ${req.params.id}`, 404)
		);
	}

	// Ensure user owns the wallet
	if (wallet.user.toString() !== req.user.id) {
		return next(new ErrorResponse("Not authorized to delete this wallet", 401));
	}

	await wallet.remove();

	// Remove wallet from user's wallets array
	req.user.wallets = req.user.wallets.filter(
		(walletId) => walletId.toString() !== req.params.id
	);
	await req.user.save();

	// Invalidate the user's wallets cache since a wallet has been deleted
	const walletCacheKey = generateCacheKey("userWallets", {
		userId: req.user.id,
	});
	const profileCacheKey = generateCacheKey("userProfile", {
		userId: req.user.id,
	});
	await deleteCache(walletCacheKey);
	await deleteCache(profileCacheKey);

	res.status(200).json({
		success: true,
		data: {},
	});
});

////
// Web3 actions
////
import createNetwork from "../web3/index.js";
import { getCurrentPrices } from "../web3/utils/price.js";
import networkConfig from "../web3/networks/networkConfig.js";

/**
 * @desc    Get wallet balance with USD, EUR, and TRY equivalents
 * @route   GET /api/v1/wallets/balance
 * @access  Public
 */
export const getWalletBalance = asyncHandler(async (req, res, next) => {
	const { walletAddress, network } = req.query;

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

	const cacheKey = generateCacheKey("walletBalance", {
		walletAddress,
		network: networkLower,
	});

	// Attempt to retrieve from cache
	const cachedBalance = await getCache(cacheKey);
	if (cachedBalance) {
		return res.status(200).json({
			success: true,
			data: cachedBalance,
			cached: true, // Indicate that data was served from cache
		});
	}

	try {
		const networkService = createNetwork(networkLower);
		const balance = await networkService.getWalletBalance(walletAddress);

		// Fetch the current prices in USD, EUR, and TRY
		const currentPrices = await getCurrentPrices(config.coinGeckoId, [
			"usd",
			"eur",
			"try",
		]);

		// Calculate USD, EUR, and TRY equivalents
		const balanceUSD = balance * currentPrices.usd;
		const balanceEUR = balance * currentPrices.eur;
		const balanceTRY = balance * currentPrices.try;

		const balanceData = {
			walletAddress,
			network: networkLower,
			balance: {
				amount: balance,
				symbol: config.symbol,
			},
			equivalents: {
				USD: {
					amount: balanceUSD,
					currency: "USD",
				},
				EUR: {
					amount: balanceEUR,
					currency: "EUR",
				},
				TRY: {
					amount: balanceTRY,
					currency: "TRY",
				},
			},
		};

		// Set cache with specific category TTL
		await setCache(cacheKey, balanceData, "walletBalance");

		res.status(200).json({
			success: true,
			data: balanceData,
			cached: false, // Data freshly fetched from the API
		});
	} catch (error) {
		next(error);
	}
});

// @desc    Get wallet token accounts
// @route   GET /api/v1/wallets/tokens
// @access  Public
export const getWalletTokenAccounts = asyncHandler(async (req, res, next) => {
	const { walletAddress, network } = req.query;

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
		});
	} catch (error) {
		next(error);
	}
});

/**
 * @desc    Get wallet transactions
 * @route   GET /api/v1/wallets/transactions
 * @access  Public
 */
export const getWalletTransactions = asyncHandler(async (req, res, next) => {
	const { walletAddress, network, type } = req.query;

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
