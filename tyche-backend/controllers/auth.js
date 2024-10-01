import User from "../models/User.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
	const { fullname, email, password } = req.body;

	// Create user
	const user = await User.create({
		fullname,
		email,
		password,
	});

	sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email & password
	if (!email || !password) {
		return next(new ErrorResponse("Please provide an email and password", 400));
	}

	// Check for user
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse("Invalid credentials", 401));
	}

	sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	res.status(statusCode).json({
		success: true,
		token,
	});
};
