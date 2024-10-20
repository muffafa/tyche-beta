import redisClient from "../config/redis.js";

/**
 * Generates a unique cache key based on the request parameters.
 * @param {string} prefix - A prefix for the cache key.
 * @param {object} params - Parameters that make the cache key unique.
 * @returns {string} - The generated cache key.
 */
export const generateCacheKey = (prefix, params) => {
	// Filter out unnecessary details and keep only relevant params
	const filteredParams = Object.entries(params)
		.filter(([key, value]) => value !== undefined && value !== null)
		.map(([key, value]) => `${key}:${value}`)
		.join(":");

	return `${prefix}:${filteredParams}`;
};

/**
 * Retrieves data from the cache based on the provided key.
 * @param {string} key - The cache key.
 * @returns {Promise<any>} - The cached data or null if not found.
 */
export const getCache = async (key) => {
	try {
		const data = await redisClient.get(key);
		if (data) {
			console.log("Cache hit for key:", key);
			return JSON.parse(data);
		}
		return null;
	} catch (error) {
		console.error(`Error getting cache for key ${key}:`, error);
		return null;
	}
};

/**
 * Sets data in the cache with an optional TTL.
 * @param {string} key - The cache key.
 * @param {any} value - The data to cache.
 * @param {number} ttl - Time to live in seconds.
 * @returns {Promise<void>}
 */
export const setCache = async (key, value, ttl = 3600) => {
	try {
		await redisClient.set(key, JSON.stringify(value), {
			EX: ttl,
		});
	} catch (error) {
		console.error(`Error setting cache for key ${key}:`, error);
	}
};
