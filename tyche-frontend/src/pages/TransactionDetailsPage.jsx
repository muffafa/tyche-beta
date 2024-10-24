import { useNavigate } from "react-router-dom";
import { useState } from "react";
import goBackIcon from "./../assets/images/icons/goBackIcon.svg";
import copyIcon from "./../assets/images/icons/walletCopyIcon.svg";
import shareIcon from "./../assets/images/icons/shareIcon.svg";
import rightArrowIcon from "./../assets/images/icons/rightArrowIcon.svg";
import QRCode from "./../assets/images/qrcode.svg";
import shortenAddress from "../utils/shortenAddress";
import TokenCard from "../components/Content/TokenCard";
import ZoomQRCode from "../components/Content/ZoomQRCode";
import { convertWalletToTag } from "../utils/convertWalletToTag";
import { useSelector } from "react-redux";

function TransactionDetailsPage() {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(false);
  const addresses = useSelector((state) => state.wallet.addresses);

  // Extract the transaction hash from the URL
  const hash = window.location.pathname.split("/")[2];

  //burası ileride tx den gelen bilgilerden alınacak
  const sent_from = "0xjhkjhasdygq9823421391802381823";
  const sent_to = "0xnsljnjwe283t7y7w78651fdfscfwet2";

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
    <div className="flex flex-col items-center justify-center w-full px-4 md:px-0 mt-4 md:mt-[80px]">
      <div className="w-full max-w-[915px] flex flex-col gap-4 md:gap-[11px]">
        <div className="flex flex-row items-center gap-[20px] w-full">
          <button
            className="flex items-center bg-tychePrimary p-[13px] cursor-pointer rounded-full"
            onClick={() => navigate(-1)}
          >
            <img src={goBackIcon} alt="Go Back" />
          </button>
          <p className="text-[24px] text-tychePrimary tracking-wide font-[350]">
            Transaction Details
          </p>
        </div>

        {/* Top section */}
        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-[11px]">
          {/* Top left */}
          <div className="flex flex-col flex-grow bg-tycheLightGray rounded-[20px] p-[25px] gap-[24px]">
            <div className="flex flex-row gap-[15px] items-center">
              <p className="text-black text-[14px] font-bold">
                Transaction Hash:
              </p>
              <div className="flex flex-row items-center">
                <p className="text-[14px] text-tycheBlue font-[350]">
                  {shortenAddress(hash)}
                </p>
                <button onClick={() => navigator.clipboard.writeText(hash)}>
                  <img
                    src={copyIcon}
                    alt="Copy"
                    className="w-[15px] h-[15px] ml-2"
                  />
                </button>
              </div>
            </div>
            <div className="flex flex-row gap-[15px]">
              <p className="text-black text-[14px] font-bold">Date:</p>
              <p className="text-[14px] text-black font-[350]">
                1 May 2023 12:00:00
              </p>
            </div>
            <div className="flex flex-row gap-[15px]">
              <p className="text-black text-[14px] font-bold">Status:</p>
              <div className="flex flex-row items-center gap-[5px]">
                <p className="text-[14px] text-black font-[350]">Completed</p>
                <div className="w-[12px] h-[12px] rounded-full bg-tycheGreen" />
              </div>
            </div>
            <div className="flex flex-row gap-[15px]">
              <p className="text-black text-[14px] font-bold">Gas Fee:</p>
              <p className="text-[14px] text-black font-[350]">0.001 USD</p>
            </div>
          </div>

          {/* Top right (QR) */}
          <div className="w-full md:w-[300px] bg-tycheLightGray rounded-[20px] p-[25px]">
            <div className="flex flex-col items-center h-full gap-[3px]">
              <p className="text-black text-[14px] font-bold mb-2">
                Show This To Others!
              </p>
              <div className="flex flex-col items-center gap-[9px]">
                <p className="text-black text-[8px] italic">
                  {"*This transaction's link"}
                </p>
                <img
                  src={QRCode}
                  alt="QR Code"
                  className="w-[80px] h-[80px] cursor-pointer"
                  onClick={() => setZoom(true)}
                />
                {zoom && <ZoomQRCode qr={QRCode} setZoom={setZoom} />}
              </div>
              <p className="text-black text-[6px] italic">
                Click and zoom to QR Code
              </p>
              <div className="h-[4px]" />
              <button className="flex flex-row gap-[5px] items-center justify-center bg-tychePrimary font-[300] text-white text-[14px] px-[10px] py-[6px] tracking-wide rounded-[60px] w-full h-fit">
                <p>Share</p>
                <img
                  src={shareIcon}
                  alt="Share"
                  className="w-[14px] h-[14px]"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Middle section (from to) */}
        <div className="flex flex-col w-full bg-tycheLightGray rounded-[20px] p-[25px]">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-black text-[14px] font-bold">From:</p>
              <p className="text-[14px] text-tycheBlue font-[350]">
                {convertWalletToTag(sent_from, addresses)}
              </p>
            </div>
            <img
              src={rightArrowIcon}
              alt="Right Arrow"
              className="w-[16px] h-[16px]"
            />
            <div className="flex flex-col items-end">
              <p className="text-black text-[14px] font-bold">To:</p>
              <p className="text-[14px] text-tycheBlue font-[350]">
                {convertWalletToTag(sent_to, addresses)}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section (transferred assets) */}
        <div className="flex flex-col w-full bg-tycheLightGray rounded-[20px] p-[25px]">
          <p className="text-[18px] font-bold mb-[15px]">Transferred Assets</p>
          <div className="flex flex-col gap-[12px]">
            {tokens.map((token, index) => (
              <TokenCard key={index} token={token} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsPage;
