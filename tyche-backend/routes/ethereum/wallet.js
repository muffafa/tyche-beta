import { Router } from "express";
import {
    getWalletPortfolio,
    getWalletPositions,
    getFungiblePositions
} from "../../controllers/ethereum/wallet.js";

const router = Router({ mergeParams: true }); // mergeParams to access :network

/**
 * @route   GET /api/v1/wallets/ehtereum/portfolio?walletAddress=<address>
 * @desc    Get wallet portfolio for specified EVM wallet address
 * @access  Public
 */
router.get("/portfolio", getWalletPortfolio);

/**
 * @route   GET /api/v1/wallets/ehtereum/positions?walletAddress=<address>&filter[positions]=<filterType>
 * @desc    Get wallet positions for specified EVM wallet address
 * @access  Public
 */
router.get("/positions", getWalletPositions);

/**
 * @route   GET /api/v1/wallets/ehtereum/fungible-positions?walletAddress=<address>&filter[positions]=<filterType>
 * @desc    Get wallet fungible positions for specified EVM wallet address
 * @access  Public
 */
router.get("/fungible-positions", getFungiblePositions);

export default router;
