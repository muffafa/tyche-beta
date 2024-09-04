import axios from "axios";
import { getNetworkShortName } from "../utils/NetworkManager";

const OKLINK_API_KEY = import.meta.env.VITE_OKLINK_API_KEY;

const apiClient = axios.create({
  baseURL: "https://www.oklink.com/api/v5/explorer",
  headers: {
    "Ok-Access-Key": OKLINK_API_KEY,
  },
});

// Function to get address information
export const getAddressInfo = async (network, address) => {
  const chainShortName = getNetworkShortName(network);
  try {
    const response = await apiClient.get(`/address/information-evm`, {
      params: {
        chainShortName,
        address,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address info:", error);
    throw error;
  }
};

// Function to get address token balances
export const getAddressTokens = async (
  network,
  address,
  protocolType = "token_20"
) => {
  const chainShortName = getNetworkShortName(network);
  try {
    const response = await apiClient.get(`/address/token-balance`, {
      params: {
        chainShortName,
        address,
        protocolType,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address tokens:", error);
    throw error;
  }
};

// Function to get address NFTs
export const getAddressNFTs = async (
  network,
  address,
  protocolType = "token_721"
) => {
  const chainShortName = getNetworkShortName(network);
  try {
    const response = await apiClient.get(`/address/token-balance`, {
      params: {
        chainShortName,
        address,
        protocolType,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address NFTs:", error);
    throw error;
  }
};

// Function to get address transactions
export const getAddressTransactions = async (network, address) => {
  console.log("network", network);

  const chainShortName = getNetworkShortName(network);
  console.log("chainShortName", chainShortName);
  try {
    const response = await apiClient.get(`/address/normal-transaction-list`, {
      params: {
        chainShortName,
        address,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address transactions:", error);
    throw error;
  }
};

// Function to get address token transactions
export const getAddressTokenTransactions = async (network, address) => {
  const chainShortName = getNetworkShortName(network);
  try {
    const response = await apiClient.get(`/address/token-transaction-list`, {
      params: {
        chainShortName,
        address,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching address token transactions:", error);
    throw error;
  }
};

// Function to get token market data
export const getTokenMarketData = async (chainId, tokenContractAddress) => {
  try {
    const response = await apiClient.get(`/tokenprice/market-data`, {
      params: {
        chainId,
        tokenContractAddress,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching token market data:", error);
    throw error;
  }
};

// Function to get NFT market data by ID
export const getNftMarketDataById = async (
  network,
  tokenContractAddress,
  tokenId
) => {
  const chainShortName = getNetworkShortName(network);
  try {
    const response = await apiClient.get(`/nft/nft-details`, {
      params: {
        chainShortName,
        tokenContractAddress,
        tokenId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching NFT market data by ID:", error);
    throw error;
  }
};
