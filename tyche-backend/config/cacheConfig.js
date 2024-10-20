/*
 * Cache configuration with TTL values in seconds.
 */
const cacheConfig = {
	default: 3600, // 1 hour

	walletBalance: 60, // 1 minute
	fiatPrice: 60 * 2, // 2 minutes
	walletTransactions: 60, // 1 minute
	tokenMetadata: 60 * 60 * 24, // 1 day
};

export default cacheConfig;
