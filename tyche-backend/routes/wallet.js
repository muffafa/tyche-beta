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

router.route("/").post(protect, addWallet).get(protect, getWallets);

router.route("/:id").put(protect, updateWallet).delete(protect, deleteWallet);

// Route: GET /api/v1/wallet/balance?walletAddress=<address>&network=<network>
// Description: Get the balance of a wallet on a specified network
router.get("/balance", getWalletBalance);

// Route: GET /api/v1/wallet/tokens?walletAddress=<address>&network=<network>
// Description: Get the token accounts of a wallet on a specified network
router.get("/tokens", getWalletTokenAccounts);

// Route: GET /api/v1/wallet/transactions?walletAddress=<address>&network=<network>
// Description: Get the transactions for a wallet on a specified network
router.get("/transactions", getWalletTransactions);

export default router;
