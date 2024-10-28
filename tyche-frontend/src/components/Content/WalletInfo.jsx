import shareIcon from "./../../assets/images/icons/shareIcon.svg";
import walletCopyIcon from "./../../assets/images/icons/walletCopyIcon.svg";
import tagEditBlueIcon from "./../../assets/images/icons/tagEditBlueIcon.svg";
import saveWalletLightBlueIcon from "./../../assets/images/icons/saveWalletLightBlueIcon.svg";
import { useEffect, useState } from "react";
import ZoomQRCode from "./ZoomQRCode";
import { useSelector } from "react-redux";
import SettingsPopup from "./SettingsPopup";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import shortenAddress from "../../utils/shortenAddress";

function WalletInfo() {
  const { address } = useParams();

  return (
    <div className="flex flex-col gap-[8px] h-[234px] w-full">
      <p className="text-[24px] text-tychePrimary tracking-wide font-[350]">
        Wallet Information
      </p>
      <div className="flex flex-row justify-start items-center bg-tycheLightGray px-[30px] py-[25px] rounded-[20px] gap-[40px] h-full">
        <ShareWallet />
        <Details walletAddress={address} />
      </div>
    </div>
  );
}

function Details({ walletAddress }) {
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const addresses = useSelector((state) => state.wallet.addresses);
  const network = useSelector((state) => state.global.selectedNetwork);
  const [SavedWallet, setSavedWallet] = useState({
    id: -1,
    address: walletAddress,
    network: network,
    tag: "",
  });

  useEffect(() => {
    const savedWallet = addresses.find(
      (address) => address.address === walletAddress
    );
    if (savedWallet) {
      setSavedWallet(savedWallet);
    } else {
      setSavedWallet({
        id: -1,
        address: walletAddress,
        network: network,
        tag: "",
      });
    }
  }, [addresses, walletAddress, network]);

  const handleCopyAddress = () => {
    // Create a temporary input element
    const tempInput = document.createElement("input");
    tempInput.value = walletAddress;
    document.body.appendChild(tempInput);

    // Select and copy the text
    tempInput.select();
    document.execCommand("copy");

    // Remove the temporary element
    document.body.removeChild(tempInput);

    // Show feedback
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="flex flex-col items-start gap-[24px]">
      <div className="flex flex-row gap-[15px]">
        <p className="text-black text-[14px] font-bold">Wallet Address:</p>
        <div className="flex flex-row items-center">
          <p className="text-[14px] text-tycheBlue min-w-[90px] font-[350] max-w-[90px] text-ellipsis overflow-hidden whitespace-nowrap">
            {shortenAddress(walletAddress)}
          </p>
          <button
            onClick={handleCopyAddress}
            className="relative"
            title="Copy address"
          >
            <img
              src={walletCopyIcon}
              alt="Copy"
              className="w-[15px] h-[15px]"
            />
            {copySuccess && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-row gap-[15px]">
        <p className="text-black text-[14px] font-bold">Private Name Tag:</p>
        <div className="flex flex-row items-center gap-[10px]">
          {SavedWallet.id !== -1 ? (
            <button
              className="flex flex-row items-center gap-[10px]"
              onClick={() => setShowSettingsPopup(true)}
            >
              <p className="text-[14px] text-tycheBlue font-[350]">
                {SavedWallet.tag}
              </p>
              <img
                src={tagEditBlueIcon}
                alt="Edit"
                className="flex w-[15px] h-[15px]"
              />
            </button>
          ) : (
            <button
              className="flex flex-row items-center justify-center gap-[10px] border-dashed border-[2px] px-[10px] py-[1px] border-tycheBlue rounded-full"
              onClick={() => setShowSettingsPopup(true)}
            >
              <div className="flex flex-row items-center justify-center gap-[5px]">
                <img
                  src={saveWalletLightBlueIcon}
                  alt="Save"
                  className="w-[10px] h-[10px]"
                />
                <p className="text-[10px] text-tycheBlue font-[350]">
                  Save Wallet
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-[15px]">
        <p className="text-black text-[14px] font-bold">Wallet Balance:</p>
        <p className="text-[14px] text-black font-[350]">263.4 USD</p>
      </div>
      <div className="flex flex-row gap-[40px]">
        <div className="flex flex-row gap-[15px]">
          <p className="text-black text-[14px] font-bold">First tx:</p>
          <p
            className="text-[14px] text-tycheBlue font-[350] cursor-pointer"
            onClick={() => console.log("First tx clicked")}
          >
            5 months ago
          </p>
        </div>
        <div className="flex flex-row gap-[15px]">
          <p className="text-black text-[14px] font-bold">Last tx:</p>
          <p
            className="text-[14px] text-tycheBlue font-[350] cursor-pointer"
            onClick={() => console.log("Last tx clicked")}
          >
            2 days ago
          </p>
        </div>
      </div>
      {showSettingsPopup && (
        <SettingsPopup
          onClose={() => setShowSettingsPopup(false)}
          preferredTab={"savedWallets"}
          newWallet={SavedWallet.id === -1 ? SavedWallet : null}
          walletToEdit={SavedWallet.id !== -1 ? SavedWallet : null}
        />
      )}
    </div>
  );
}

function ShareWallet() {
  const [zoom, setZoom] = useState(false);
  return (
    <div className="flex flex-col items-center h-full gap-[3px]">
      <div className="flex flex-col items-center gap-[9px]">
        <p className="text-black text-[8px] italic">{"*This page's link"}</p>
        <QRCode
          size={80}
          value={window.location.href}
          className="w-[80px] h-[80px] cursor-pointer"
          onClick={() => setZoom(true)}
        />
        {zoom && <ZoomQRCode value={window.location.href} setZoom={setZoom} />}
      </div>
      <p className="text-black text-[6px] italic">Click and zoom to QR Code</p>
      <div className="h-[4px]" />
      <button className="flex flex-row gap-[5px] items-center justify-center bg-tychePrimary font-[300] text-white text-[14px] px-[10px] py-[6px] tracking-wide rounded-[60px] w-full h-fit">
        <p>Share</p>
        <img src={shareIcon} alt="Share" className="w-[14px] h-[14px]" />
      </button>
    </div>
  );
}

export default WalletInfo;
