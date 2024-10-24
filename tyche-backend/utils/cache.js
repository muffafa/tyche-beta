import { redisClient, getRedisAvailability } from "../config/redis.js";
import cacheConfig from "../config/cacheConfig.js";
import {
	getInMemoryCache,
	setInMemoryCache,
	deleteInMemoryCache,
} from "../config/fallbackCache.js";

/**
 * Generates a unique cache key based on the request parameters.
 * @param {string} prefix - A prefix for the cache key.
 * @param {object} params - Parameters that make the cache key unique.
 * @returns {string} - The generated cache key.
 */
export const generateCacheKey = (prefix, params) => {
	const filteredParams = Object.entries(params)
		.filter(([key, value]) => value !== undefined && value !== null)
		.map(([key, value]) => `${key}:${value}`)
		.join(":");

	return `${prefix}:${filteredParams}`;
};

/**
 * Retrieves data from the cache based on the provided key.
 * Uses Redis if available; otherwise, falls back to in-memory cache.
 * @param {string} key - The cache key.
 * @returns {Promise<any>} - The cached data or null if not found.
 */
export const getCache = async (key) => {
	if (getRedisAvailability()) {
		try {
			const data = await redisClient.get(key);
			if (data) {
				console.log(`Redis Cache hit for key ${key}`);
				return JSON.parse(data);
			}
			return null;
		} catch (error) {
			console.error(`Error getting Redis cache for key ${key}:`, error);
			return null;
		}
	} else {
		// Use in-memory cache
		return await getInMemoryCache(key);
	}
};

/**
 * Sets data in the cache with an appropriate TTL.
 * Uses Redis if available; otherwise, falls back to in-memory cache.
 * @param {string} key - The cache key.
 * @param {any} value - The data to cache.
 * @param {string} category - The cache category to determine TTL.
 * @returns {Promise<void>}
 */
export const setCache = async (key, value, category = "default") => {
	if (getRedisAvailability()) {
		try {
			const ttl = cacheConfig[category] || cacheConfig.default;
			await redisClient.set(key, JSON.stringify(value), { EX: ttl });
			console.log(`Redis Cache set for key ${key} with TTL ${ttl}s`);
		} catch (error) {
			console.error(`Error setting Redis cache for key ${key}:`, error);
		}
	} else {
		// Use in-memory cache
		await setInMemoryCache(key, value, category);
	}
};

/**
 * Deletes data from the cache based on the provided key.
 * Uses Redis if available; otherwise, falls back to in-memory cache.
 * @param {string} key - The cache key to delete.
 * @returns {Promise<void>}
 */
export const deleteCache = async (key) => {
	if (getRedisAvailability()) {
		try {
			await redisClient.del(key);
			console.log(`Redis Cache deleted for key ${key}`);
		} catch (error) {
			console.error(`Error deleting Redis cache for key ${key}:`, error);
		}
	} else {
		// Use in-memory cache
		await deleteInMemoryCache(key);
	}
};
