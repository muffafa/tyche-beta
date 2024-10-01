import asyncHandler from "../middleware/async.js";
import Transaction from "../models/Transaction.js";

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Public
export const getTransactions = asyncHandler(async (req, res, next) => {
	const transactions = await Transaction.find();
	res
		.status(200)
		.json({ success: true, count: transactions.length, data: transactions });
});

// @desc    Create a transaction
// @route   POST /api/v1/transactions
// @access  Public
export const createTransaction = asyncHandler(async (req, res, next) => {
	const transaction = await Transaction.create(req.body);
	res.status(201).json({ success: true, data: transaction });
});

// @desc    Get a single transaction
// @route   GET /api/v1/transactions/:id
// @access  Public
export const getTransaction = asyncHandler(async (req, res, next) => {
	const transaction = await Transaction.findById(req.params.id);
	if (!transaction) {
		return res
			.status(404)
			.json({ success: false, message: "Transaction not found" });
	}
	res.status(200).json({ success: true, data: transaction });
});

// @desc    Update transaction status
// @route   PUT /api/v1/transactions/:id
// @access  Private
export const updateTransaction = asyncHandler(async (req, res, next) => {
	const transaction = await Transaction.findByIdAndUpdate(
		req.params.id,
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);
	if (!transaction) {
		return res
			.status(404)
			.json({ success: false, message: "Transaction not found" });
	}
	res.status(200).json({ success: true, data: transaction });
});

// @desc    Delete a transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
export const deleteTransaction = asyncHandler(async (req, res, next) => {
	const transaction = await Transaction.findByIdAndDelete(req.params.id);
	if (!transaction) {
		return res
			.status(404)
			.json({ success: false, message: "Transaction not found" });
	}
	res.status(200).json({ success: true, message: "Transaction removed" });
});
