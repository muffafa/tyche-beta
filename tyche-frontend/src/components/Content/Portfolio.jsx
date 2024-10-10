import { useState } from "react";
import PropTypes from "prop-types";
import TokenCard from "./TokenCard";
import NftCard from "./NftCard";

function Portfolio({ tokens, nfts }) {
  const [activeTab, setActiveTab] = useState("tokens");

  // Determine the height to apply consistently to both tabs
  const consistentHeightClass =
    tokens.length > 3 || nfts.length > 3 ? "max-h-[258px]" : "min-h-[258px]";

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[24px] text-tychePrimary tracking-wide font-[350]">Portfolio</p>
      <div className="bg-tycheLightGray shadow rounded-[20px] col-span-4">
        <div className="flex justify-between mb-4">
          <button
            className={`w-1/2 ${
              activeTab === "tokens"
                ? "bg-tychePrimary text-white"
                : "bg-tycheLightGray text-black"
            } px-4 py-2 rounded-tl-[20px]`}
            onClick={() => setActiveTab("tokens")}
          >
            Tokens
          </button>
          <button
            className={`w-1/2 ${
              activeTab === "nfts"
                ? "bg-tychePrimary text-white"
                : "bg-tycheLightGray text-black"
            } px-4 py-2 rounded-tr-[20px]`}
            onClick={() => setActiveTab("nfts")}
          >
            NFTs
          </button>
        </div>
        {activeTab === "tokens" ? (
          <>
            <div className="top-0 bg-tycheLightGray">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Amount</th>
                    <th>Value</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className={`overflow-y-scroll ${consistentHeightClass}`}>
              {tokens.length > 0 ? (
                <table className="w-full text-left">
                  <tbody>
                    {tokens.map((token, index) => (
                      <tr key={index} className="bg-tycheWhite rounded">
                        <td className="p-2">
                          <TokenCard token={token} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-tycheGray">No tokens found.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="top-0 bg-tycheBeige">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Token ID</th>
                    <th>Contract</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className={`overflow-y-scroll ${consistentHeightClass}`}>
              {nfts.length > 0 ? (
                <table className="w-full text-left">
                  <tbody>
                    {nfts.map((nft, index) => (
                      <tr key={index} className="bg-tycheWhite rounded">
                        <td className="p-2">
                          <NftCard nft={nft} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-tycheGray">No NFTs found.</p>
              )}
            </div>
          </>
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
