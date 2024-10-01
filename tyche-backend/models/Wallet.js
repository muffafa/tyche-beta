import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

// Ensure the environment variables are properly loaded
if (!process.env.WALLET_ENCRYPTION_SECRET) {
	throw new Error(
		"WALLET_ENCRYPTION_SECRET is not set in the environment variables"
	);
}

if (!process.env.WALLET_SIGNING_KEY) {
	throw new Error("WALLET_SIGNING_KEY is not set in the environment variables");
}

const WalletSchema = new mongoose.Schema({
	address: {
		type: String,
		required: [true, "Please add a wallet address"],
	},
	network: {
		type: String,
		required: [true, "Please specify the blockchain network"],
		enum: ["Ethereum", "Solana", "Binance Smart Chain", "Polygon", "Other"],
		default: "Ethereum",
	},
	nickname: {
		type: String,
		maxlength: [30, "Nickname can not exceed 30 characters"],
		trim: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	addedAt: {
		type: Date,
		default: Date.now,
	},
});

// Encryption setup
const encKey = Buffer.from(process.env.WALLET_ENCRYPTION_SECRET, "hex"); // 32 bytes for AES-256
const sigKey = Buffer.from(process.env.WALLET_SIGNING_KEY, "base64"); // Convert base64 string to Buffer

WalletSchema.plugin(encrypt, {
	encryptionKey: encKey,
	signingKey: sigKey,
	encryptedFields: ["address"],
});

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;
