import SolanaNetwork from "./networks/solana.js";
import EthereumNetwork from "./networks/ethereum.js";

const networks = {
	solana: SolanaNetwork,
	ethereum: EthereumNetwork,
};

const createNetwork = (networkType) => {
	const NetworkClass = networks[networkType.toLowerCase()];
	if (!NetworkClass) {
		throw new Error(`Network type "${networkType}" is not supported.`);
	}

	// Fetch API keys based on network type
	let networkInstance;
	if (networkType.toLowerCase() === "solana") {
		const apiKey = process.env.ALCHEMY_API_KEY;
		const heliusApiKey = process.env.HELIUS_API_KEY;
		if (!apiKey) {
			throw new Error(
				"ALCHEMY_API_KEY is not defined in the environment variables."
			);
		}
		if (!heliusApiKey) {
			throw new Error(
				"HELIUS_API_KEY is not defined in the environment variables."
			);
		}
		networkInstance = new NetworkClass(apiKey, heliusApiKey);
	} else if (networkType.toLowerCase() === "ethereum") {
		const zerionApiKey = process.env.ZERION_API_KEY;
		if (!zerionApiKey) {
			throw new Error(
				"ZERION_API_KEY is not defined in the environment variables."
			);
		}
		networkInstance = new NetworkClass(zerionApiKey);
	} else {
		throw new Error(`Unsupported network type: ${networkType}`);
	}

	return networkInstance;
};

export default createNetwork;
