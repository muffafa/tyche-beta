import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NetworkSelect from "./NetworkSelect";
import SearchBar from "./SearchBar";
import WalletConnect from "./WalletConnect";
import GeneralSettingsPopup from "../Popups/GeneralSettingsPopup";
import usePopupState from "../../hooks/usePopupState";

function Header() {
  const [lastSearchedAddress, setLastSearchedAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const navigate = useNavigate();

  // Use the custom hook for managing the General Settings popup state
  const {
    isOpen: isSettingsOpen,
    openPopup: openSettings,
    closePopup: closeSettings,
  } = usePopupState();

  const handleSearch = (address) => {
    setLastSearchedAddress(address);
    navigate(`/${selectedNetwork.toLowerCase()}/${address}`);
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
  };

  const handleSaveSettings = (settings) => {
    console.log("Settings saved:", settings);
    // Here you can also save the settings locally or in the global state
  };

  return (
    <header className="header bg-tycheBlue p-4 flex justify-between items-center">
      <div className="logo">
        <img src="/tyche.png" alt="Tyche Logo" />
      </div>
      <SearchBar
        onSearch={handleSearch}
        lastSearchedAddress={lastSearchedAddress}
      />
      <NetworkSelect
        selectedNetwork={selectedNetwork}
        onSelectNetwork={handleNetworkSelect}
      />
      <WalletConnect />
      <button
        className="ml-4 px-4 py-2 bg-tycheGray text-white rounded"
        onClick={openSettings}
      >
        Settings
      </button>

      {isSettingsOpen && (
        <GeneralSettingsPopup
          settings={{ currency: "USD", timezone: "GMT+0" }}
          onSave={handleSaveSettings}
          onClose={closeSettings}
        />
      )}
    </header>
  );
}

export default Header;
