import { verify } from "jsonwebtoken";
import asyncHandler from "./async";
import ErrorResponse from "../utils/errorResponse";
import { findById } from "../models/User";

export const protect = asyncHandler(async (req, res, next) => {
	let token;

	// Check for token in headers
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		// Set token from Bearer token in header
		token = req.headers.authorization.split(" ")[1];
	}

	// Make sure token exists
	if (!token) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}

	try {
		// Verify token
		const decoded = verify(token, process.env.JWT_SECRET);

		// Attach user to request
		req.user = await findById(decoded.id).select("-password");
		next();
	} catch (err) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
});
