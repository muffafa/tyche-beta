import { useState } from "react";
import PropTypes from "prop-types";
import TokenCard from "./TokenCard";
import NftCard from "./NftCard";

function Portfolio({ tokens, nfts }) {
  const [activeTab, setActiveTab] = useState("tokens");

  return (
    <div className="p-4 bg-tycheBeige shadow rounded col-span-4">
      <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
      <div className="flex justify-between mb-4">
        <button
          className={`w-1/2 ${
            activeTab === "tokens"
              ? "bg-tycheGreen text-white"
              : "bg-tycheGray text-white"
          } px-4 py-2 rounded-l`}
          onClick={() => setActiveTab("tokens")}
        >
          Tokens
        </button>
        <button
          className={`w-1/2 ${
            activeTab === "nfts"
              ? "bg-tycheGreen text-white"
              : "bg-tycheGray text-white"
          } px-4 py-2 rounded-r`}
          onClick={() => setActiveTab("nfts")}
        >
          NFTs
        </button>
      </div>

      {activeTab === "tokens" ? (
        <div className="relative">
          <div className="sticky top-0 bg-tycheBeige z-10">
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
          <div
            className={`overflow-y-scroll ${
              tokens.length > 3 ? "max-h-[142px]" : "min-h-[142px]"
            }`}
          >
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
        </div>
      ) : (
        <div className="relative">
          <div className="sticky top-0 bg-tycheBeige z-10">
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
          <div
            className={`overflow-y-scroll ${
              nfts.length > 3 ? "max-h-[142px]" : "min-h-[142px]"
            }`}
          >
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
        </div>
      )}
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
