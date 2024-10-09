import PropTypes from "prop-types";
import popupCloseIcon from "./../../assets/images/icons/popupCloseIcon.svg";
import { useState } from "react";

function SettingsPopup({ onClose }) {
    const [activeTab, setActiveTab] = useState("settings");
    return (
        <>
            <div className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
                <div className="fixed bg-white rounded-[40px] w-[50%] h-[80%] items-center">
                    {PopupTabs(activeTab, setActiveTab, onClose)}
                    <div className="flex flex-col w-full justify-center p-8">
                        {activeTab === "settings" ? <GeneralSettings /> : <SavedWallets />}
                    </div>
                </div>
            </div>
        </>
    );
}

SettingsPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default SettingsPopup;

function GeneralSettings() {
    return (
    <div className="flex flex-col gap-[45px]">
        <div className="flex flex-row gap-4 items-center">
            <p className="flex font-medium text-[20px]">
                Currency:
            </p>
            <select
                id="currency"
                name="currency"
                className="flex items-center bg-tychePrimary text-white text-[20px] px-6 py-1 h-[50px] rounded-full w-fit focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
            >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
            </select>
        </div>
        <div className="flex flex-row gap-4 items-center">
            <p className="flex font-medium text-[20px]">
                Timezone:
            </p>
            <select
                id="timezone"
                name="timezone"
                className="flex items-center bg-tychePrimary text-white text-[20px] px-6 py-1 h-[50px] w-fit rounded-full focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
            >
                <option>Europe/Berlin (CET)</option>
                <option>Europe/London (GMT)</option>
                <option>Europe/Moscow (MSK)</option>
            </select>
        </div>
    </div>
    );
}

function SavedWallets(){
    const wallets = [
        {
            address: "0x1234567890",
            tag: "My Wallet",
            network: "Ethereum"
        },
        {
            address: "0x0987654321",
            tag: "My Wallet",
            network: "Solana"
        }
    ];
    return (
        <>
            <div className="flex flex-col gap-[35px] w-full">
                <select
                    id="currency"
                    name="currency"
                    className="flex items-center bg-tychePrimary text-white text-[20px] py-[13px] w-fit px-[20px] h-[50px] rounded-full focus:outline-none focus:ring-tycheGreen focus:border-tycheGreen"
                >
                    <option>All Networks</option>
                    <option>Ethereum</option>
                    <option>Solana</option>
                </select>
                <div className="flex flex-col gap-[20px] w-full">
                    {/* Burası değişecek */}
                    <div className="flex flex-row gap-4 items-center justify-between w-full">
                        <p className="flex font-bold text-[20px]">
                            Address
                        </p>
                        <p className="flex font-bold text-[20px]">
                            Tag
                        </p>
                        <p className="flex font-bold text-[20px]">
                            Network
                        </p>
                        <p className="flex font-bold text-[20px]">
                            Operations
                        </p>
                    </div>
                    {wallets.map((wallet, index) => (
                        <div key={index} className="flex flex-row gap-4 items-center justify-between w-full">
                            <p className="flex text-[20px]">
                                {wallet.address}
                            </p>
                            <p className="flex text-[20px]">
                                {wallet.tag}
                            </p>
                            <p className="flex text-[20px]">
                                {wallet.network}
                            </p>
                            <button className="flex items-center justify-center bg-tycheRed text-white text-[20px] px-4 py-1 rounded-full">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function PopupTabs(activeTab, setActiveTab, onClose) {
    return <div className="flex flex-grow justify-between items-center h-[85px]">
        <button className={`${activeTab === 'settings' ? 'bg-white text-black' : 'bg-tychePrimary text-white'} p-1 rounded-tl-[40px] w-full h-full flex items-center justify-center`} onClick={() => setActiveTab("settings")}>
            <div className="flex items-center justify-center gap-2 p-2 w-full h-full font-bold text-[24px]">
                General Settings
            </div>
        </button>
        <button className={`${activeTab === 'savedWallets' ? 'bg-white text-black' : 'bg-tychePrimary text-white'} p-1 w-full h-full flex items-center justify-center`} onClick={() => setActiveTab("savedWallets")}>
            <div className="flex items-center justify-center gap-2 p-2 w-full h-full font-bold text-[24px]">
                Saved Wallets
            </div>
        </button>
        <button onClick={onClose} className="bg-tycheRed p-1 rounded-tr-[40px] flex min-w-[100px] h-full items-center justify-center">
            <img src={popupCloseIcon} alt="Close" />
        </button>
    </div>;
}
