import PropTypes from "prop-types";
import QRCode from "./../../assets/images/qrcode.png";
import shareIcon from "./../../assets/images/icons/shareIcon.svg";

function WalletInfo(){
    return (
        <div className="flex flex-col gap-[8px] h-[234px] w-full">
            <p className="text-[24px] text-tychePrimary tracking-wide font-[350]">Wallet Information</p>
            <div className="flex flex-row justify-start items-center bg-tycheLightGray px-[30px] py-[25px] rounded-[20px] gap-[40px] h-full">
                <ShareWallet />
                <Details />
            </div>
        </div>
    );
}

WalletInfo.propTypes = {
    currentNetwork: PropTypes.string.isRequired,
    currentAddress: PropTypes.string.isRequired,
};

export default WalletInfo;

function Details() {
    return <div className="flex flex-col items-center">
        <p className="text-tycheGray text-[14px]">Wallet Address</p>
        <p className="text-tycheBlack text-[20px]">0.00 ETH</p>
    </div>;
}

function ShareWallet() {
    return (
        <div className="flex flex-col items-center h-full gap-[3px]">
            <div className="flex flex-col items-center gap-[9px]">
                <p className="text-black text-[8px] italic">{"*This page's link"}</p>
                <img src={QRCode} alt="QR Code" className="w-[80px] h-[80px]"/>
            </div>
            <p className="text-black text-[6px] italic">Click and zoom to QR Code</p>
            <div className="h-[4px]"/>
            <button
                className="flex flex-row gap-[5px] items-center justify-center bg-tychePrimary font-[300] text-white text-[14px] px-[10px] py-[6px] tracking-wide rounded-[60px] w-full h-fit">
                <p>Share</p>
                <img src={shareIcon} alt="Share" className="w-[14px] h-[14px]"/>
          </button>
        </div>
    );
}
