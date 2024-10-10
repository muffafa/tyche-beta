import { useState } from "react";
import PropTypes from "prop-types";
import TokenCard from "./TokenCard";
import NftCard from "./NftCard";

function Portfolio({ tokens, nfts }) {
  const [activeTab, setActiveTab] = useState("tokens");

  // Determine the height to apply consistently to both tabs
  const consistentHeightClass =
    tokens.length > 3 || nfts.length > 3 ? "max-h-[290px]" : "min-h-[290px]";

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[24px] text-tychePrimary tracking-wide font-[350]">
        Portfolio
      </p>
      <div className="bg-tycheLightGray shadow rounded-[20px] col-span-4">
        <div className="flex justify-between mb-4">
          <button
            className={`w-1/2 ${
              activeTab === "tokens"
                ? "bg-tycheLightGray text-black"
                : "bg-tychePrimary text-white"
            } px-4 py-2 rounded-tl-[20px]`}
            onClick={() => setActiveTab("tokens")}
          >
            Tokens
          </button>
          <button
            className={`w-1/2 ${
              activeTab === "nfts"
                ? "bg-tycheLightGray text-black"
                : "bg-tychePrimary text-white"
            } px-4 py-2 rounded-tr-[20px]`}
            onClick={() => setActiveTab("nfts")}
          >
            NFTs
          </button>
        </div>
        {activeTab === "tokens" ? (
          <div className="px-[25px] gap-[12px] h-[290px]">
            <p
              className="text-[12px] text-tycheBlue font-bold justify-end w-full flex cursor-pointer"
              onClick={() => console.log("Show as a graph")}
            >
              Show as a graph
            </p>
            <div className="top-0 bg-tycheLightGray">
              <table className="w-full font-normal text-[12px]">
                <tr className="flex flex-row w-full">
                  <td className="flex w-full justify-start">Asset</td>
                  <td className="flex w-full justify-start">Amount</td>
                  <td className="flex w-full justify-end pr-[6px]">Value</td>
                </tr>
              </table>
            </div>
            <div className={`overflow-y-scroll ${consistentHeightClass}`}>
              {tokens.length > 0 ? (
                <table className="w-full text-left flex">
                  <tbody className="gap-[12px] flex flex-col w-full">
                    {tokens.map((token, index) => (
                      <tr key={index} className="bg-tycheLightGray flex w-full">
                        <td className="w-full">
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
          <div className="px-[25px] gap-[12px] h-[290px]">
            <div className={`overflow-y-scroll ${consistentHeightClass}`}>
              {nfts.length > 0 ? (
                <div className="flex flex-wrap gap-x-[20px] gap-y-[10px] justify-center pb-[10px]">
                  {nfts.map((nft, index) => (
                    <NftCard key={index} nft={nft} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-tycheGray">No NFTs found.</p>
              )}
            </div>
          </div>
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
      header: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      basePrice: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Portfolio;
