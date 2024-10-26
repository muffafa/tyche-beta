import { Router } from "express";
import {
	register,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	updatePassword,
	googleAuth,
	updateCurrency
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

// Protected routes
router.get("/me", protect, getMe);
router.put("/updatepassword", protect, updatePassword);
router.put("/preferredcurrency", protect, updateCurrency);


export default router;