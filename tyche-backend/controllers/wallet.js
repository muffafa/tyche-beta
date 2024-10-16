import Wallet from "../models/Wallet.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
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
	const wallets = await Wallet.find({ user: req.user.id }).select("-__v");

	res.status(200).json({
		success: true,
		count: wallets.length,
		data: wallets,
	});
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

		res.status(200).json({
			success: true,
			data: {
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
			},
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

	try {
		const networkService = createNetwork(network);
		const tokens = await networkService.getWalletTokenAccounts(walletAddress);

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
 * @desc    Get wallet transactions with pagination
 * @route   GET /api/v1/wallets/transactions
 * @access  Public
 */
export const getWalletTransactions = asyncHandler(async (req, res, next) => {
	const { walletAddress, network, page, limit } = req.query;

	if (!walletAddress || !network) {
		return next(
			new ErrorResponse(
				"walletAddress and network are required parameters.",
				400
			)
		);
	}

	// Parse pagination parameters with default values
	const pageNumber = parseInt(page, 10) || 1;
	const limitNumber = parseInt(limit, 10) || 5;

	// Validate pagination parameters
	if (pageNumber < 1) {
		return next(new ErrorResponse("Page number must be at least 1.", 400));
	}

	if (limitNumber < 1 || limitNumber > 1000) {
		return next(new ErrorResponse("Limit must be between 1 and 1000.", 400));
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

		// Limiti next page olup olmadigini anlamak icin 1 arttirip fetch ediyorum!
		// API'ye her zaman +1 istek gidiyor!!!
		const fetchLimit = pageNumber * limitNumber + 1;

		// Fetch transactions up to the current page
		const allTransactions = await networkService.getAllTransactions(
			walletAddress,
			{ limit: fetchLimit }
		);

		// Slice transactions for the current page
		const startIndex = (pageNumber - 1) * limitNumber;
		const paginatedTransactions = allTransactions.slice(
			startIndex,
			startIndex + limitNumber
		);

		// Determine if there is a next page
		const hasNextPage = allTransactions.length > pageNumber * limitNumber;

		// Fetch first and last transactions only once
		let firstTransaction = null;
		let lastTransaction = null;

		if (pageNumber === 1 && paginatedTransactions.length > 0) {
			firstTransaction = {
				transactionId:
					paginatedTransactions[paginatedTransactions.length - 1].signature,
				date: paginatedTransactions[paginatedTransactions.length - 1].date,
			};
		}

		if (paginatedTransactions.length > 0) {
			lastTransaction = {
				transactionId:
					paginatedTransactions[paginatedTransactions.length - 1].signature,
				date: paginatedTransactions[paginatedTransactions.length - 1].date,
			};
		}

		res.status(200).json({
			success: true,
			pagination: {
				currentPage: pageNumber,
				limit: limitNumber,
				hasNextPage,
			},
			data: {
				walletAddress,
				network: networkLower,
				firstTransaction,
				lastTransaction,
				transactions: paginatedTransactions,
			},
		});
	} catch (error) {
		next(error);
	}
});
