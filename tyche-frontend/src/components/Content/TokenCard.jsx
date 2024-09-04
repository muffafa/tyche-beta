import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTokenMarketData } from "../../utils/api";
import formatCurrency from "../../utils/formatCurrency";
import { getChainIdByNetwork } from "../../utils/NetworkManager";

function TokenCard({ token }) {
  const [formattedValue, setFormattedValue] = useState(null);
  const selectedCurrency = useSelector((state) => state.settings.currency);
  const selectedNetwork = useSelector((state) => state.global.selectedNetwork); // Fetching networkName from Redux store
  const assetImage = ""; // Placeholder for the image source

  useEffect(() => {
    const fetchTokenValue = async () => {
      try {
        // Step 1: Get the chainId using the network name
        const chainId = getChainIdByNetwork(selectedNetwork);
        if (!chainId) {
          console.error("Unsupported network:", selectedNetwork);
          return;
        }

        // Step 2: Fetch token market data
        const marketData = await getTokenMarketData(
          chainId,
          token.tokenContractAddress
        );
        console.log(marketData);
        const lastPrice = marketData?.data?.[0]?.lastPrice || 0;
        console.log(lastPrice);

        // Step 3: Calculate the token value in USDT
        const valueInUSDT = parseFloat(token.holdingAmount) * lastPrice;

        // Step 4: Convert the value to the selected currency
        const convertedValue = await formatCurrency(
          valueInUSDT,
          selectedCurrency
        );

        // Step 5: Set the formatted value
        setFormattedValue(convertedValue);
      } catch (error) {
        console.error("Error calculating token value:", error);
      }
    };

    fetchTokenValue();
  }, [
    token.holdingAmount,
    token.tokenContractAddress,
    selectedNetwork, // Using the selectedNetwork from Redux
    selectedCurrency,
  ]);

  return (
    <div className="token-card bg-tycheBeige p-4 mb-4 rounded shadow flex justify-between items-center">
      {/* Asset Image */}
      <div className="token-asset flex items-center">
        {assetImage ? (
          <img src={assetImage} alt={token.symbol} className="w-8 h-8 mr-4" />
        ) : (
          <div className="w-8 h-8 mr-4 bg-gray-300 rounded"></div>
        )}
      </div>

      {/* Token Info */}
      <div className="token-info flex-1">
        <h5 className="text-tycheBlue font-bold">{token.symbol}</h5>
        <p className="text-tycheGray">
          {token.holdingAmount} {token.symbol}
        </p>
      </div>

      {/* Token Amount & Value */}
      <div className="token-amount">
        <span className="text-tycheBlue font-bold">
          {formattedValue || token.holdingAmount}
        </span>
        <span className="text-tycheGray"> {selectedCurrency}</span>
      </div>
    </div>
  );
}

TokenCard.propTypes = {
  token: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    tokenContractAddress: PropTypes.string.isRequired,
    holdingAmount: PropTypes.string.isRequired,
    valueUsd: PropTypes.string, // This will be used later for value calculations
  }).isRequired,
};

export default TokenCard;
