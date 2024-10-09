import { Router } from "express";
import { register, login, getMe } from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe); // Protected route

export default router;
