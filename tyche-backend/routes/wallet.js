import { Router } from "express";
import {
	addWallet,
	getWallets,
	updateWallet,
	deleteWallet
} from "../controllers/wallet.js";
import { protect } from "../middleware/auth.js";
import solanaWalletRoutes from "./solana/wallet.js";
import ethereumWalletRoutes from "./ethereum/wallet.js";
// import ethereumWalletRoutes from "./ethereum/wallet.js";
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
 * Mount network-specific wallet routers
 */
router.use("/solana", solanaWalletRoutes);
router.use("/ethereum", ethereumWalletRoutes);

export default router;
