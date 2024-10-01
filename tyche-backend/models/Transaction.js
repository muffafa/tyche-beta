import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
	walletAddress: {
		type: String,
		required: true,
	},
	transactionHash: {
		type: String,
		required: true,
		unique: true,
	},
	network: {
		type: String,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "confirmed", "failed"],
		default: "pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

export default Transaction;
