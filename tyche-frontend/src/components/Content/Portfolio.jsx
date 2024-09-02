import { useSelector } from "react-redux";
import TokenCard from "./TokenCard";
import NftCard from "./NftCard";

function Portfolio() {
  const portfolio = useSelector((state) => state.global.portfolio);
  const nfts = useSelector((state) => state.global.nfts);

  return (
    <div className="portfolio-container">
      <h3 className="text-2xl font-bold text-tycheBlue mb-4">Portfolio</h3>
      <div className="tokens-section mb-8">
        <h4 className="text-xl text-tycheGray mb-4">Tokens</h4>
        {portfolio.length > 0 ? (
          portfolio.map((token, index) => (
            <TokenCard key={index} token={token} />
          ))
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

export default Portfolio;
