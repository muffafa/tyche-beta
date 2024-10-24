import { Router } from "express";
import {
    getWalletBalance,
    getWalletTokenAccounts,
    getWalletTransactions
} from "../../controllers/solana/wallet.js";

const router = Router({ mergeParams: true }); // mergeParams to access :network

/**
 * @route   GET /api/v1/wallets/solana/balance?walletAddress=<address>
 * @desc    Get the balance of a Solana wallet
 * @access  Public
 */
router.get("/balance", getWalletBalance);

/**
 * @route   GET /api/v1/wallets/solana/tokens
 * @desc    Get the tokens of a Solana wallet
 * @access  Public
 */
router.get("/tokens", getWalletTokenAccounts);


/**
 * @route   GET /api/v1/wallet/solana/transactions?walletAddress=<address>
 * @desc    Get the transaction history of a Solana wallet
 * @access  Public
 * @queryParams
 *  - walletAddress (string, required): The wallet address to fetch transactions for.
 */
router.get("/transactions", getWalletTransactions);
export default router;
