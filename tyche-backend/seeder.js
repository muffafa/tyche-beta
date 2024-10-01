// seeder.js

import "dotenv/config";
import colors from "colors";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Wallet from "./models/Wallet.js";

// Connect to MongoDB
connectDB();

// Define dummy users data
const users = [
	{
		fullname: "Arda Altinors",
		email: "arda@example.com",
		password: "password123",
	},
	{
		fullname: "Jane Smith",
		email: "jane@example.com",
		password: "password123",
	},
];

// Define dummy wallets data
const wallets = [
	{
		address: "0xARDA01a7D398351b8bE11C439e05C5B3259aec9B",
		network: "Ethereum",
		nickname: "arda eth",
		userEmail: "arda@example.com",
	},
	{
		address: "So11111111111111111111111111111111111111112", // Example Solana address
		network: "Solana",
		nickname: "John's Solana Wallet",
		userEmail: "arda@example.com",
	},
	{
		address: "0xmufaffa5Cc6634C0532925a3b844Bc4544438f44e", // Example Ethereum address
		network: "Ethereum",
		nickname: "Jane's Ethereum Wallet",
		userEmail: "jane@example.com",
	},
	{
		address: "Bnb1grpf0955h0ykm4cx3g0tyky0e0kuxn3qwun70a", // Example Binance Smart Chain address
		network: "Binance Smart Chain",
		nickname: "Jane's BSC Wallet",
		userEmail: "jane@example.com",
	},
];

// Function to import data into the database
const importData = async () => {
	try {
		// Delete existing data
		await Wallet.deleteMany();
		await User.deleteMany();

		console.log("Existing data deleted.".red.inverse);

		// Create users
		const createdUsers = await User.create(users);
		console.log("Dummy users created.".green.inverse);

		// Create wallets and associate them with users
		for (const walletData of wallets) {
			// Find the user by email
			const user = createdUsers.find(
				(user) => user.email === walletData.userEmail
			);
			if (!user) {
				console.error(`User with email ${walletData.userEmail} not found`.red);
				continue; // Skip if user not found
			}

			// Create wallet
			const wallet = await Wallet.create({
				address: walletData.address,
				network: walletData.network,
				nickname: walletData.nickname,
				user: user._id,
			});

			// Add wallet to user's wallets array
			user.wallets.push(wallet._id);
		}

		// Save all users after adding wallets
		await Promise.all(createdUsers.map((user) => user.save()));

		console.log(
			"Dummy wallets created and associated with users.".green.inverse
		);

		process.exit();
	} catch (err) {
		console.error(`${err}`.red);
		process.exit(1);
	}
};

// Execute the importData function
importData();
