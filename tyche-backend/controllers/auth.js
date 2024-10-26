import User from "../models/User.js";
import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import Wallet from "../models/Wallet.js";
import {
	getCache,
	setCache,
	generateCacheKey,
	deleteCache,
} from "../utils/cache.js";

// Get token from model, create response and send
const sendTokenResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();

	res.status(statusCode).json({
		success: true,
		token,
	});
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
	const { fullname, email, password } = req.body;

	if (!email || !password) {
		return next(new ErrorResponse("Please provide an email and password", 400));
	}

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

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res, next) => {
	// Generate a unique cache key for the user's profile
	const cacheKey = generateCacheKey("userProfile", { userId: req.user.id });

	// Attempt to retrieve the user profile from the cache
	const cachedUserProfile = await getCache(cacheKey);
	if (cachedUserProfile) {
		return res.status(200).json({
			success: true,
			data: cachedUserProfile.user,
			wallets: cachedUserProfile.wallets,
			cached: true,
		});
	}

	try {
		// Fetch the user and their wallets from the database
		const user = await User.findById(req.user.id).select("-__v -wallets");
		const wallets = await Wallet.find({ user: req.user.id }).select("-__v");

		const userProfileData = { user, wallets };

		// Cache the user profile data
		await setCache(cacheKey, userProfileData, "userProfile");

		res.status(200).json({
			success: true,
			data: user,
			wallets,
			cached: false,
		});
	} catch (error) {
		next(error);
	}
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
	const { email } = req.body;

	const user = await User.findOne({ email });

	if (!user) {
		return next(new ErrorResponse("There is no user with that email", 404));
	}

	// Get reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	// Create reset url
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease make a PUT request to the following URL:\n\n${resetUrl}\n\nThis link will expire in 10 minutes. If you did not request this, please ignore this email.`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Password reset token",
			message,
		});

		res.status(200).json({
			success: true,
			data: "Email sent",
		});
	} catch (err) {
		console.error(err);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse("Email could not be sent", 500));
	}
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res, next) => {
	// Get hashed token
	const resetPasswordToken = crypto
		.createHash("sha256")
		.update(req.params.resettoken)
		.digest("hex");

	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new ErrorResponse("Invalid token", 400));
	}

	// Set new password
	user.password = req.body.password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	sendTokenResponse(user, 200, res);
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select("+password");

	// Check current password
	if (!(await user.matchPassword(req.body.currentPassword))) {
		return next(new ErrorResponse("Password is incorrect", 401));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});


//
// Google OAuth Authentication
import { OAuth2Client } from "google-auth-library";

// Initialize Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// @desc    Google Sign-In / Register
// @route   POST /api/v1/auth/google
// @access  Public
export const googleAuth = asyncHandler(async (req, res, next) => {
	const { idToken } = req.body;

	if (!idToken) {
		return next(new ErrorResponse("No ID token provided", 400));
	}

	let ticket;
	try {
		ticket = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});
	} catch (error) {
		return next(new ErrorResponse("Invalid ID token", 400));
	}

	const payload = ticket.getPayload();
	const { sub: googleId, email, name: fullname, picture } = payload;

	if (!email) {
		return next(new ErrorResponse("Google account has no email", 400));
	}

	// Check if user exists
	let user = await User.findOne({ email });

	if (user) {
		// If user exists but doesn't have a googleId, associate it
		if (!user.googleId) {
			user.googleId = googleId;
			await user.save();
		}
	} else {
		// Create new user
		user = await User.create({
			fullname,
			email,
			googleId,
		});
	}

	sendTokenResponse(user, 200, res);
});


// @desc    Update user's preferred currency
// @route   PUT /api/v1/auth/preferredcurrency
// @access  Private
export const updateCurrency = asyncHandler(async (req, res, next) => {
	const { preferredCurrency } = req.body;

	// Validate the preferredCurrency
	const validCurrencies = ["USD", "EUR", "TRY", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK"];
	if (!preferredCurrency || !validCurrencies.includes(preferredCurrency)) {
		return next(new ErrorResponse(`Please provide a valid preferredCurrency. Valid options are: ${validCurrencies.join(", ")}`, 400));
	}

	try {
		// Find the user and update preferredCurrency
		const user = await User.findByIdAndUpdate(
			req.user.id,
			{ preferredCurrency },
			{ new: true, runValidators: true }
		);

		res.status(200).json({
			success: true,
			data: {
				preferredCurrency: user.preferredCurrency,
			},
		});
	} catch (error) {
		next(error);
	}
});
