import { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // For accessing Redux state
import { useNavigate } from "react-router-dom";
import NetworkSelect from "./NetworkSelect";
import SearchBar from "./SearchBar";
import WalletConnect from "./WalletConnect";
import GeneralSettingsPopup from "../Popups/GeneralSettingsPopup";
import usePopupState from "../../hooks/usePopupState";

function Header() {
  const navigate = useNavigate();

  // Access the selectedNetwork and walletAddress from Redux (but don't dispatch changes)
  const storedNetwork = useSelector((state) => state.global.selectedNetwork);
  const storedWalletAddress = useSelector(
    (state) => state.global.walletAddress
  );

  const [lastSearchedAddress, setLastSearchedAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    isOpen: isSettingsOpen,
    openPopup: openSettings,
    closePopup: closeSettings,
  } = usePopupState();

  // Set initial selectedNetwork based on the Redux state (run only once on mount)
  useEffect(() => {
    if (storedNetwork) {
      setSelectedNetwork(storedNetwork);
    }
  }, [storedNetwork]);

  // Set initial lastSearchedAddress based on the Redux state (run only once on mount)
  useEffect(() => {
    if (storedWalletAddress) {
      setLastSearchedAddress(storedWalletAddress);
    }
  }, [storedWalletAddress]);

  const handleSearch = (address) => {
    setLastSearchedAddress(address);
    navigate(`/${selectedNetwork.toLowerCase()}/${address}`);
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
  };

  const handleSaveSettings = (settings) => {
    console.log("Settings saved:", settings);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="flex flex-wrap items-center justify-between p-4 bg-tycheWhite shadow">
      <div
        className="relative h-12 w-12 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img
          src="/tyche.png"
          alt="Tyche Logo"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex-grow mx-2 min-w-0">
        <SearchBar
          onSearch={handleSearch}
          lastSearchedAddress={lastSearchedAddress} // Pass Redux-stored address to SearchBar
        />
      </div>
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <div className="hidden sm:flex items-center space-x-2">
          <NetworkSelect
            selectedNetwork={selectedNetwork}
            onSelectNetwork={handleNetworkSelect}
          />
          <WalletConnect />
        </div>
        <button
          className="sm:hidden px-2 py-1 bg-tycheGray text-white rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menu
        </button>
        <button
          className="px-2 py-1 bg-tycheGray text-white rounded"
          onClick={openSettings}
        >
          Settings
        </button>
      </div>

      {isMenuOpen && (
        <div className="w-full mt-2 flex flex-col space-y-2 sm:hidden">
          <NetworkSelect
            selectedNetwork={selectedNetwork}
            onSelectNetwork={handleNetworkSelect}
          />
          <WalletConnect />
        </div>
      )}

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
