import { Router } from "express";
import {
    getWalletTransactions,
    getWalletPositions,
    getNonFungiblePositions
} from "../../controllers/ethereum/wallet.js";

const router = Router({ mergeParams: true }); // mergeParams to access :network

/**
 * @route   GET /api/v1/wallets/ehtereum/transactions?walletAddress=<address>&chain_id=<chain_id>
 * @desc    Get wallet transactions for specified EVM wallet address
 * @access  Public
 */
router.get("/transactions", getWalletTransactions);

/**
 * @route   GET /api/v1/wallets/ehtereum/positions?walletAddress=<address>&filter[positions]=<filterType>
 * @desc    Get wallet positions for specified EVM wallet address
 * @access  Public
 */
router.get("/positions", getWalletPositions);

/**
 * @route   GET /api/v1/wallets/ehtereum/nonfungible-positions?walletAddress=<address>&filter[positions]=<filterType>
 * @desc    Get wallet fungible positions for specified EVM wallet address
 * @access  Public
 */
router.get("/nonfungible-positions", getNonFungiblePositions);

export default router;
