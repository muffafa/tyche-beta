import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NetworkSelect from "./NetworkSelect";
import SearchBar from "./SearchBar";
import WalletConnect from "./WalletConnect";

function Header() {
  const networks = ["Ethereum", "Bitcoin", "Avalanche", "BNB Smart Chain"];
  const [lastSearchedAddress, setLastSearchedAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const navigate = useNavigate();

  const handleSearch = (address) => {
    setLastSearchedAddress(address);
    // Kullanıcıyı WalletDetailsPage'e yönlendir
    navigate(`/${selectedNetwork.toLowerCase()}/${address}`);
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
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
        networks={networks}
        selectedNetwork={selectedNetwork}
        onSelectNetwork={handleNetworkSelect}
      />
      <WalletConnect />
    </header>
  );
}

export default Header;
