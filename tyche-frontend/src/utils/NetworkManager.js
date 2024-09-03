// src/utils/NetworkManager.js

const networkMappings = {
  ethereum: "eth",
  "bnb smart chain": "bsc",
  avalanche: "avaxc",
  bitcoin: "btc",
  // Add other networks as needed
};

export function getNetworkShortName(networkName) {
  // Convert the network name to lowercase to handle case sensitivity
  const normalizedNetworkName = networkName.toLowerCase();
  return networkMappings[normalizedNetworkName] || "";
}

export function getSupportedNetworks() {
  // Return the original case network names
  return Object.keys(networkMappings);
}

export function getDappsByNetwork(networkName, dappMetadata) {
  const networkShortName = getNetworkShortName(networkName);
  return dappMetadata[networkShortName] || [];
}
