import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Wallet from "./models/Wallet.js";
import Transaction from "./models/Transaction.js";
import User from "./models/User.js"; // Assuming you have a User model
import connectDB from "./config/db.js";

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to the database
connectDB();

// Sample user data
const users = [
	{
		email: "admin@admin.com",
		password: "password123",
	},
	{
		email: "arda@altinors.com",
		password: "password123",
	},
];

// Sample wallet data (we will add userId later)
let wallets = [
	{
		address: "0x1234567890abcdef1234567890abcdef12345678",
		network: "Ethereum",
		nickname: "Main Wallet",
	},
	{
		address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
		network: "Ethereum",
		nickname: "Backup Wallet",
	},
];

// Sample transaction data
let transactions = [
	{
		walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
		transactionHash: "0xabcdefabcdefabcdefabcdefabcdefabcdef12345678",
		network: "Ethereum",
		amount: 1.5,
		status: "confirmed",
	},
	{
		walletAddress: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
		transactionHash: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdabcd",
		network: "Ethereum",
		amount: 2.2,
		status: "pending",
	},
];

// Insert data into MongoDB
const importData = async () => {
	try {
		await Wallet.deleteMany();
		await Transaction.deleteMany();
		await User.deleteMany(); // Clear users

		const createdUsers = await User.insertMany(users); // Insert users
		const user1 = createdUsers[0]._id; // Get user ID from the created users
		const user2 = createdUsers[1]._id;

		// Assign user IDs to wallets
		wallets = wallets.map((wallet, index) => {
			return { ...wallet, userId: index % 2 === 0 ? user1 : user2 };
		});

		await Wallet.insertMany(wallets);
		await Transaction.insertMany(transactions);

		console.log("Data Imported!".green.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

// Delete data from MongoDB
const deleteData = async () => {
	try {
		await Wallet.deleteMany();
		await Transaction.deleteMany();
		await User.deleteMany(); // Clear users

		console.log("Data Deleted!".red.inverse);
		process.exit();
	} catch (error) {
		console.error(`${error}`.red.inverse);
		process.exit(1);
	}
};

// Check command-line arguments
if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
