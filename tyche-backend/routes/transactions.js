import express from "express";
import { getTransactionDetails } from "../controllers/transactions.js";

const router = express.Router();

// Route: GET /api/v1/transactions/:txid?network=<network>
// Description: Get detailed information about a specific transaction
router.get("/:txid", getTransactionDetails);

export default router;
