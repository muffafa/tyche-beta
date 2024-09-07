// src/utils/NetworkManager.js

const networkMappings = {
  ethereum: "eth",
  "bnb smart chain": "bsc",
  avalanche: "avaxc",
  base: "base",
  // Add other networks as needed
};

const chainIdMappings = {
  eth: "1",
  bsc: "56",
  avaxc: "43114",
  btc: "0",
};

export function getNetworkShortName(networkName) {
  const normalizedNetworkName = networkName.toLowerCase();
  return networkMappings[normalizedNetworkName] || "";
}

export function getChainIdByNetwork(networkName) {
  const shortName = getNetworkShortName(networkName);
  return chainIdMappings[shortName] || null;
}

export function getSupportedNetworks() {
  return Object.keys(networkMappings);
}

export function getDappsByNetwork(networkName, dappMetadata) {
  const networkShortName = getNetworkShortName(networkName);
  return dappMetadata[networkShortName] || [];
}
