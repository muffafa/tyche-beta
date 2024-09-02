import PropTypes from "prop-types";

function NftCard({ nft }) {
  return (
    <div className="nft-card bg-tycheBeige p-4 mb-4 rounded shadow">
      <img src={nft.image} alt={nft.name} className="nft-image mb-2" />
      <h5 className="text-tycheBlue font-bold">{nft.name}</h5>
      <p className="text-tycheGray">Floor Price: {nft.floorPrice}</p>
    </div>
  );
}

NftCard.propTypes = {
  nft: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    floorPrice: PropTypes.string.isRequired,
  }).isRequired,
};

export default NftCard;
