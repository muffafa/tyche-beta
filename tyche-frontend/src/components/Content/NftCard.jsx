import PropTypes from "prop-types";

function NftCard({ nft }) {
  return (
    <div className="nft-card bg-tycheBeige p-4 mb-4 rounded shadow">
      <div className="nft-image mb-2">
        <img src={""} alt={nft.symbol} className="h-24 w-24 object-contain" />
      </div>
      <h5 className="text-tycheBlue font-bold">{nft.symbol}</h5>
      <p className="text-tycheGray">Token ID: {nft.tokenId}</p>
      <p className="text-tycheGray">Contract: {nft.tokenContractAddress}</p>
    </div>
  );
}

NftCard.propTypes = {
  nft: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    tokenContractAddress: PropTypes.string.isRequired,
    tokenId: PropTypes.string.isRequired,
  }).isRequired,
};

export default NftCard;
