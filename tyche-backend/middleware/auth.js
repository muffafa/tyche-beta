import pkg from "jsonwebtoken"; // Import the default export
const { verify } = pkg; // Destructure to get the verify function

import asyncHandler from "./async.js";
import ErrorResponse from "../utils/errorResponse.js";
import User from "../models/User.js"; // Import the User model

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
		req.user = await User.findById(decoded.id).select("-password"); // Use User.findById
		next();
	} catch (err) {
		return next(new ErrorResponse("Not authorized to access this route", 401));
	}
});
