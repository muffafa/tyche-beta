import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

// Configuration for reconnection strategy
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second

let reconnectAttempts = 0;
let isRedisAvailable = false;

// Create Redis client with reconnection strategy
const redisClient = createClient({
	url: process.env.REDIS_URL || "redis://localhost:6379",
	socket: {
		reconnectStrategy: (retries) => {
			if (retries >= MAX_RECONNECT_ATTEMPTS) {
				console.error(`Redis: Exceeded maximum reconnection attempts (${MAX_RECONNECT_ATTEMPTS}).`);
				return new Error("Reconnect failed");
			}
			// Exponential backoff with jitter
			const delay = Math.min(INITIAL_RECONNECT_DELAY * 2 ** retries, 30000); // Max 30 seconds
			const jitter = Math.random() * 1000; // Up to 1 second
			reconnectAttempts = retries + 1; // Track the attempt count manually
			const totalDelay = delay + jitter;
			console.log(`Redis: Reconnecting in ${totalDelay}ms... (Attempt ${reconnectAttempts})`);
			return totalDelay;
		},
	},
});

// Event listeners
redisClient.on("error", (err) => {
	console.error("Redis Client Error:", err);
	isRedisAvailable = false;
});

redisClient.on("reconnecting", () => {
	console.log(`Redis: Attempting to reconnect (#${reconnectAttempts})`);
});

redisClient.on("ready", () => {
	isRedisAvailable = true;
	console.log("Redis: Connection is ready.");
});

redisClient.on("end", () => {
	isRedisAvailable = false;
	console.warn("Redis: Connection has ended.");
});

// Initial connection attempt
redisClient.connect()
	.then(() => {
		isRedisAvailable = true;
	})
	.catch((err) => {
		console.error("Redis: Initial connection failed. Continuing without Redis caching.", err);
		isRedisAvailable = false;
	});

// Getter for availability flag
const getRedisAvailability = () => isRedisAvailable;

export { redisClient, getRedisAvailability };
