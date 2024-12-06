// src/utils/NetworkManager.js
import solIcon from "./../assets/images/coin/sol.svg";
import ethIcon from "../assets/images/coin/eth.svg";
import btcIcon from "../assets/images/coin/btc.svg";
import avaxcIcon from "../assets/images/coin/avaxc.svg";
import bscIcon from "../assets/images/coin/bnb.svg";
import baseIcon from "../assets/images/coin/base.svg";

const networkMappings = {
  sol: "Solana",
  eth: "Ethereum",
  bsc: "BNB Smart Chain",
  avaxc: "Avalanche",
  base: "Base",
  btc: "Bitcoin",
  // Add other networks as needed
};

const chainIdMappings = {
  eth: "1",
  bsc: "56",
  avaxc: "43114",
  btc: "0",
};

const networkIcons = {
  sol: solIcon,
  eth: ethIcon,
  bsc: bscIcon,
  avaxc: avaxcIcon,
  base: baseIcon,
  btc: btcIcon,
};

export function getNetworkShortName(networkName) {
  const normalizedNetworkName = networkName.toLowerCase();
  return networkMappings[normalizedNetworkName] || "";
}

export function getChainIdByNetwork(networkName) {
  const shortName = getNetworkShortName(networkName);
  return chainIdMappings[shortName] || null;
}

export function getNetworkIcon(networkName) {
  //const shortName = getNetworkShortName(networkName);
  return networkIcons[networkName] || null;
}

export function getSupportedNetworkPairs() {
  return Object.entries(networkMappings);
}

export function getDappsByNetwork(networkName, dappMetadata) {
  const networkShortName = getNetworkShortName(networkName);
  return dappMetadata[networkShortName] || [];
}
