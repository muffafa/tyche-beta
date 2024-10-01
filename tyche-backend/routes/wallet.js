import { Router } from "express";
import {
	addWallet,
	getWallets,
	updateWallet,
	deleteWallet,
} from "../controllers/wallet.js";
import { protect } from "../middleware/auth.js";
const router = Router();

router.route("/").post(protect, addWallet).get(protect, getWallets);

router.route("/:id").put(protect, updateWallet).delete(protect, deleteWallet);

export default router;
