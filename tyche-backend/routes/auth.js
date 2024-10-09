import { Router } from "express";
import {
	register,
	login,
	getMe,
	forgotPassword,
	resetPassword,
	updatePassword,
} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatepassword", protect, updatePassword); // Protected route

export default router;
