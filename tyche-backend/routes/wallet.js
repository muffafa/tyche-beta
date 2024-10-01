import express from "express";
import {
	createWallet,
	getWallets,
	getWallet,
	updateWallet,
	deleteWallet,
} from "../controllers/wallet.js";

const router = express.Router();

router.route("/").get(getWallets).post(createWallet);
router.route("/:id").get(getWallet).put(updateWallet).delete(deleteWallet);

export default router;
