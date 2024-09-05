import axios from "axios";

// const ALCHEMY_API_KEY = import.meta.env.ALCHEMY_API_KEY;

const fetchPriceUsd = async (symbol) => {
  try {
    // Fetch price data from the CoinGecko API (or any other API you prefer)
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      {
        params: {
          ids: symbol,
          vs_currencies: "usd",
        },
      }
    );

    // Return the price in USD
    return response.data[symbol]?.usd || 1; // Return 1 if price data is unavailable
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return 1; // Default to 1 USD if there is an error
  }
};

export const processNativeTokenData = async (addressInfo, network) => {
  // Extract necessary fields from the getAddressInfo response
  const { balance, balanceSymbol } = addressInfo;

  // Fetch the price of the native token (ETH, BTC, etc.)
  const priceUsd = await fetchPriceUsd(network);

  console.log(balanceSymbol);

  const nativeTokenData = {
    symbol: balanceSymbol, // Native token symbol (e.g., ETH)
    tokenContractAddress: "", // Native tokens don't have contract addresses
    holdingAmount: balance, // The balance of the native token
    priceUsd: priceUsd.toString(), // Convert priceUsd to string
    valueUsd: (parseFloat(balance) * priceUsd).toFixed(2).toString(), // Convert valueUsd to string
    tokenId: "", // No tokenId for native tokens
  };

  return nativeTokenData;
};

export const concatNativeTokenWithTokenData = (nativeTokenData, tokenData) => {
  // Ensure tokenData structure is valid before appending
  if (
    tokenData &&
    tokenData.data &&
    tokenData.data[0] &&
    tokenData.data[0].tokenList
  ) {
    // Concatenate native token data with the token list
    tokenData.data[0].tokenList = [
      ...tokenData.data[0].tokenList,
      nativeTokenData,
    ];
  } else {
    // Handle cases where tokenData is not properly structured
    tokenData = {
      data: [
        {
          tokenList: [nativeTokenData],
        },
      ],
    };
  }

  return tokenData;
};
