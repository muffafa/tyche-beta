import NodeCache from "node-cache";
import cacheConfig from "./cacheConfig.js";

// Initialize in-memory cache with standard TTL and checkperiod
const inMemoryCache = new NodeCache({
    stdTTL: cacheConfig.default,
    checkperiod: 120
});

/**
 * Retrieves data from the in-memory cache based on the provided key.
 * @param {string} key - The cache key.
 * @returns {Promise<any>} - The cached data or null if not found.
 */
const getInMemoryCache = async (key) => {
    try {
        const data = inMemoryCache.get(key);
        if (data !== undefined) {
            console.log(`In-Memory Cache hit for key ${key}`);
            return data;
        }
        return null;
    } catch (error) {
        console.error(`Error getting in-memory cache for key ${key}:`, error);
        return null;
    }
};

/**
 * Sets data in the in-memory cache with an appropriate TTL.
 * @param {string} key - The cache key.
 * @param {any} value - The data to cache.
 * @param {string} category - The cache category to determine TTL.
 * @returns {Promise<void>}
 */
const setInMemoryCache = async (key, value, category = "default") => {
    try {
        const ttl = cacheConfig[category] || cacheConfig.default;
        inMemoryCache.set(key, value, ttl);
    } catch (error) {
        console.error(`Error setting in-memory cache for key ${key}:`, error);
    }
};

/**
 * Deletes data from the in-memory cache based on the provided key.
 * @param {string} key - The cache key to delete.
 * @returns {Promise<void>}
 */
const deleteInMemoryCache = async (key) => {
    try {
        inMemoryCache.del(key);
        console.log(`In-Memory Cache deleted for key ${key}`);
    } catch (error) {
        console.error(`Error deleting in-memory cache for key ${key}:`, error);
    }
};

export { getInMemoryCache, setInMemoryCache, deleteInMemoryCache };
