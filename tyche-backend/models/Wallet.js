import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	address: {
		type: String,
		required: [true, "Please add a wallet address"],
		unique: true,
	},
	network: {
		type: String,
		required: [true, "Please specify the blockchain network"],
	},
	nickname: {
		type: String,
		required: [true, "Please add a nickname for this wallet"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
