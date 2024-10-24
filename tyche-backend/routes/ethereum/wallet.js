import { Router } from "express";
import {
    getWalletPortfolio
} from "../../controllers/ethereum/wallet.js";

const router = Router({ mergeParams: true }); // mergeParams to access :network

/**
 * @route   GET /api/v1/wallets/ehtereum/portfolio?walletAddress=<address>
 * @desc    Get wallet portfolio for specified EVM wallet address
 * @access  Public
 */
router.get("/portfolio", getWalletPortfolio);

export default router;
