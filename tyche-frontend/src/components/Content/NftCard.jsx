import PropTypes from "prop-types";
import nftPic from "./../../assets/images/nft.png";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import formatCurrency from "../../utils/formatCurrency";

function NftCard({ nft }) {
  const [formattedValue, setFormattedValue] = useState(null);
  const selectedCurrency = useSelector((state) => state.settings.currency);
  const selectedNetwork = useSelector((state) => state.global.selectedNetwork); // Fetching networkName from Redux store



  useEffect(() => {
    const fetchTokenValue = async () => {
      try {
        const convertedValue = await formatCurrency(
          nft.basePrice,
          selectedCurrency
        );

        setFormattedValue(convertedValue);
      } catch (error) {
        console.error("Error calculating token value:", error);
      }
    };

    fetchTokenValue();
  }, [
    nft.id,
    nft.basePrice,
    selectedNetwork, // Using the selectedNetwork from Redux
    selectedCurrency,
  ]);
  return (
    <div className="nft-card bg-white p-[5px] rounded-[5px] flex justify-between items-center w-fit">
      <div className="nft-info flex flex-col items-start gap-[6px] w-fit">
        <div className="nft-image">
          <img src={nftPic} alt={nft.header} className="min-h-[100px] min-w-[100px] max-h-[100px] max-w-[100px]" />
        </div>
        <div className="nft-details flex flex-col gap-[6px]">
          <div className="flex flex-row gap-[4px] text-[8px]">
            <p className="text-black">{nft.header}</p>
            <p className="text-[#929292]">#{nft.id}</p>
          </div>
          <div className="flex flex-row gap-[4px] text-[6px] text-black">
            <p>Base Price:</p>
            <p>{formattedValue || nft.basePrice} {selectedCurrency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

NftCard.propTypes = {
  nft: PropTypes.shape({
    header: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    basePrice: PropTypes.string.isRequired,
  }).isRequired,
};

export default NftCard;
