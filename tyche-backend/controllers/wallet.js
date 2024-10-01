import asyncHandler from "../middleware/async.js";
import Wallet from "../models/Wallet.js";

// @desc    Get all wallets
// @route   GET /api/v1/wallets
// @access  Private
export const getWallets = asyncHandler(async (req, res, next) => {
	const wallets = await Wallet.find();
	res.status(200).json({
		success: true,
		count: wallets.length,
		data: wallets,
	});
});

// @desc    Create a wallet
// @route   POST /api/v1/wallets
// @access  Private
export const createWallet = asyncHandler(async (req, res, next) => {
	const wallet = await Wallet.create(req.body);
	res.status(201).json({ success: true, data: wallet });
});

// @desc    Get a single wallet
// @route   GET /api/v1/wallets/:id
// @access  Private
export const getWallet = asyncHandler(async (req, res, next) => {
	const wallet = await Wallet.findById(req.params.id);
	if (!wallet) {
		return res
			.status(404)
			.json({ success: false, message: "Wallet not found" });
	}
	res.status(200).json({ success: true, data: wallet });
});

// @desc    Update wallet nickname
// @route   PUT /api/v1/wallets/:id
// @access  Public
export const updateWallet = asyncHandler(async (req, res, next) => {
	const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});
	if (!wallet) {
		return res
			.status(404)
			.json({ success: false, message: "Wallet not found" });
	}
	res.status(200).json({ success: true, data: wallet });
});

// @desc    Delete a wallet
// @route   DELETE /api/v1/wallets/:id
// @access  Public
export const deleteWallet = asyncHandler(async (req, res, next) => {
	const wallet = await Wallet.findByIdAndDelete(req.params.id);
	if (!wallet) {
		return res
			.status(404)
			.json({ success: false, message: "Wallet not found" });
	}
	res.status(200).json({ success: true, message: "Wallet removed" });
});
