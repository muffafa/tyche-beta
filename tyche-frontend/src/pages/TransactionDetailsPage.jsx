import { useNavigate } from "react-router-dom";
import goBackIcon from "./../assets/images/icons/goBackIcon.svg";
import copyIcon from "./../assets/images/icons/walletCopyIcon.svg";
import shareIcon from "./../assets/images/icons/shareIcon.svg";
import rightArrowIcon from "./../assets/images/icons/rightArrowIcon.svg";
import QRCode from "./../assets/images/qrcode.svg";
import shortenAddress from "../utils/shortenAddress";
import TokenCard from "../components/Content/TokenCard";

function TransactionDetailsPage() {
  const navigate = useNavigate();

  // Extract the transaction hash from the URL
  const hash = window.location.pathname.split("/")[2];

  // Example tokens array
  const tokens = [
    {
      symbol: "SOL",
      tokenContractAddress: "0x1234",
      holdingAmount: 1.5,
      valueUsd: 218.28,
    },
    // Add more tokens if needed
  ];

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-[20px] w-[575px] mt-[71px]">
          <div className="flex flex-row items-center justify-start gap-[20px] w-full">
            <button
              className="flex items-center bg-tychePrimary p-[13px] cursor-pointer rounded-full"
              onClick={() => navigate("/")}
            >
              <img src={goBackIcon} alt="Go Back" />
            </button>
            <p className="text-[32px] tracking-wide font-[350] text-[#646464]">
              Transaction Details
            </p>
          </div>
          <div className="w-[575px] h-auto bg-tycheLightGray rounded-[26px] px-[45px] py-[40px]">
            <div className="flex flex-col w-full h-full">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-[7px]">
                  <p className="text-[36px] font-[550] tracking-wide text-tycheBlue">
                    {shortenAddress(hash)}
                  </p>
                  <button
                    className="flex items-center cursor-pointer rounded-full"
                    onClick={() => navigator.clipboard.writeText(hash)}
                  >
                    <img
                      src={copyIcon}
                      alt="Copy"
                      className="w-[32px] h-[32px]"
                    />
                  </button>
                </div>
                <button className="flex flex-row gap-[5px] items-center justify-center bg-tychePrimary font-[300] text-white text-[20px] px-[10px] py-[9px] tracking-wide rounded-[60px] w-[167px] h-fit">
                  <p>Share</p>
                  <img
                    src={shareIcon}
                    alt="Share"
                    className="w-[14px] h-[14px]"
                  />
                </button>
              </div>
              <div className="flex flex-row gap-[20px] mt-[40px] justify-between">
                <div className="flex flex-col gap-[33px]">
                  <div className="flex flex-col">
                    <p className="text-[18px] font-[550] text-black">
                      1 May 2023
                    </p>
                    <p className="text-[18px] font-[350] text-black">
                      12:00:00
                    </p>
                  </div>

                  <div className="flex flex-row gap-[5px] items-center">
                    <p className="text-[18px] font-[550] text-black">Status:</p>
                    <p className="text-[18px] font-[350] text-black">
                      Completed
                    </p>
                    <div className="flex items-center justify-center w-[12px] h-[12px] rounded-full bg-tycheGreen" />
                  </div>
                  <div className="flex flex-row gap-[5px] items-center">
                    <p className="text-[18px] font-[550] text-black">
                      Gas Fee:
                    </p>
                    <p className="text-[18px] font-[350] text-black">
                      0.001 USD
                    </p>
                  </div>
                </div>
                <img
                  src={QRCode}
                  alt="QR Code"
                  className="w-[167px] h-[167px]"
                />
              </div>
              <div className="flex flex-row gap-[20px] mt-[40px] justify-between items-center">
                <div className="flex flex-row gap-[22px]">
                  <p className="text-[18px] font-[550] text-black">From:</p>
                  <p className="text-[18px] font-[350] text-tycheBlue">
                    0x12fjbfn...
                  </p>
                </div>
                <img
                  src={rightArrowIcon}
                  alt="Right Arrow"
                  className="w-[16px] h-[16px] flex items-center"
                />
                <div className="flex flex-row gap-[22px]">
                  <p className="text-[18px] font-[550] text-black">To:</p>
                  <p className="text-[18px] font-[350] text-tycheBlue">
                    0x1237777...
                  </p>
                </div>
              </div>
              <div className="flex flex-col mt-[37px]">
                <div className="top-0 bg-tycheLightGray">
                  <table className="w-full font-[550] text-[18px]">
                    <tr className="flex flex-row w-full">
                      <td className="flex w-full justify-start">Asset</td>
                      <td className="flex w-full justify-start">Amount</td>
                      <td className="flex w-full justify-end pr-[6px]">
                        Value
                      </td>
                    </tr>
                  </table>
                </div>

                {/* Adjusted token list section to avoid scrolling */}
                <div className="flex flex-col gap-[12px]">
                  {tokens.map((token, index) => (
                    <TokenCard key={index} token={token} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionDetailsPage;
