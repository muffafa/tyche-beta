import { Router } from "express";
import {
	addWallet,
	getWallets,
	updateWallet,
	deleteWallet,
	getWalletBalance,
	getWalletTokenAccounts,
	getWalletTransactions,
} from "../controllers/wallet.js";
import { protect } from "../middleware/auth.js";
const router = Router();

/**
 * @route   POST /api/v1/wallets
 * @desc    Add a new wallet for the logged-in user
 * @access  Private
 */
router.route("/").post(protect, addWallet);

/**
 * @route   GET /api/v1/wallets
 * @desc    Get all wallets associated with the logged-in user
 * @access  Private
 */
router.route("/").get(protect, getWallets);

/**
 * @route   PUT /api/v1/wallets/:id
 * @desc    Update the nickname of a specific wallet for the logged-in user
 * @access  Private
 */
router.route("/:id").put(protect, updateWallet);

/**
 * @route   DELETE /api/v1/wallets/:id
 * @desc    Delete a specific wallet for the logged-in user
 * @access  Private
 */
router.route("/:id").delete(protect, deleteWallet);

/**
 * @route   GET /api/v1/wallet/balance?walletAddress=<address>&network=<network>
 * @desc    Get the balance of a wallet in a specified network, along with equivalent values in USD, EUR, and TRY
 * @access  Public
 */
router.get("/balance", getWalletBalance);

/**
 * @route   GET /api/v1/wallet/tokens?walletAddress=<address>&network=<network>
 * @desc    Get the token accounts of a wallet in a specified network
 * @access  Public
 */
router.get("/tokens", getWalletTokenAccounts);

/**
 * @route   GET /api/v1/wallet/transactions?walletAddress=<address>&network=<network>&page=<page>&limit=<limit>
 * @desc    Get the transaction history of a wallet in a specified network with pagination
 * @access  Public
 * @queryParams
 *  - walletAddress (string, required): The wallet address to fetch transactions for.
 *  - network (string, required): The network of the wallet (e.g., Solana).
 *  - page (number, optional): The page number for pagination (default: 1).
 *  - limit (number, optional): The number of transactions per page (default: 5, max: 1000).
 */
router.get("/transactions", getWalletTransactions);

export default router;
