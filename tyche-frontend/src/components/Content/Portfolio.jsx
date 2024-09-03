import PropTypes from "prop-types";
import TokenCard from "./TokenCard";
import NftCard from "./NftCard";

function Portfolio({ tokens, nfts }) {
  return (
    <div className="portfolio-container">
      <h3 className="text-2xl font-bold text-tycheBlue mb-4">Portfolio</h3>
      <div className="tokens-section mb-8">
        <h4 className="text-xl text-tycheGray mb-4">Tokens</h4>
        {tokens.length > 0 ? (
          tokens.map((token, index) => <TokenCard key={index} token={token} />)
        ) : (
          <p className="text-tycheGray">No tokens found.</p>
        )}
      </div>
      <div className="nfts-section">
        <h4 className="text-xl text-tycheGray mb-4">NFTs</h4>
        {nfts.length > 0 ? (
          nfts.map((nft, index) => <NftCard key={index} nft={nft} />)
        ) : (
          <p className="text-tycheGray">No NFTs found.</p>
        )}
      </div>
    </div>
  );
}

Portfolio.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      tokenContractAddress: PropTypes.string.isRequired,
      holdingAmount: PropTypes.string.isRequired,
      priceUsd: PropTypes.string,
      valueUsd: PropTypes.string,
      tokenId: PropTypes.string,
    })
  ).isRequired,
  nfts: PropTypes.arrayOf(
    PropTypes.shape({
      symbol: PropTypes.string.isRequired,
      tokenContractAddress: PropTypes.string.isRequired,
      tokenType: PropTypes.string,
      holdingAmount: PropTypes.string.isRequired,
      priceUsd: PropTypes.string,
      valueUsd: PropTypes.string,
      tokenId: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Portfolio;
