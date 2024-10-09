import "dotenv/config"; // Automatically loads environment variables
// Load environment variables
import express from "express";
import cors from "cors";
import morgan from "morgan";
import colors from "colors";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js";
import wallet from "./routes/wallet.js";
import transactions from "./routes/transactions.js";

// Connect to database
connectDB();

// initialize express
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Body parser
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Routes
app.get("/", (req, res) => {
	res.send("Welcome to Tyche Backend API");
});

// Mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/wallets", wallet);
app.use("/api/v1/transactions", transactions);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
	console.log(`💥Error: ${err.message}`.red.bold);
	// Close server and exit process
	server.close(() => process.exit(1));
});
