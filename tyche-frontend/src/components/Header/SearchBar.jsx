// import { useState, useEffect } from "react";
import searchIcon from "../../assets/images/icons/searchIcon.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNetwork } from "../../redux/slices/globalSlice";
import NetworkSelect from "./NetworkSelect";
import { getNetworkIcon, getSupportedNetworkPairs } from "../../utils/NetworkManager";
import { useEffect, useState } from "react";

function SearchBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const supportedNetworks = getSupportedNetworkPairs();
  const selectedNetwork = useSelector((state) => state.global.selectedNetwork);
  const [localNetwork, setLocalNetwork] = useState(selectedNetwork);


  let searchTerm = "";
  if (window.location.pathname.split("/")[2] === "address") {
    searchTerm = window.location.pathname.split("/")[3] || "";
  }

  const handleSearch = () => {
    if (searchTerm) {
      dispatch(setNetwork(localNetwork));
      navigate(`/${localNetwork}/address/${searchTerm}`);
    }
  };

  useEffect(() => {
    //check current url contains address or tx
    const isAddressPage = window.location.pathname.split("/")[2] === "address";
    const isTxPage = window.location.pathname.split("/")[2] === "tx";
    if (isAddressPage || isTxPage) {
      const url_network = window.location.pathname.split("/")[1]; // get network from url
      // if network is not supported, redirect to 404
      const isSupportedNetwork = supportedNetworks.some(([key,]) => key === url_network);
      //console.log("isSupportedNetwork", isSupportedNetwork);
      if (!isSupportedNetwork) {
        navigate("/404");
      } else if (localNetwork !== url_network) {
        dispatch(setNetwork(url_network));
        setLocalNetwork(url_network);
        navigate(`/${url_network}/address/${searchTerm}`);
      }
    }
  } , []);

  return (
    <div className="flex items-center w-full relative">
      {/* Dropdown */}
      <div className="flex items-center h-[40px] md:h-[54px] rounded-full bg-tycheDarkGray p-[6px] md:p-[10px] absolute z-10">
        <img
          src={getNetworkIcon(localNetwork)}
          alt={localNetwork}
          className="border-[2px] md:border-[4px] border-white rounded-full w-6 h-6 md:w-8 md:h-8"
        />
        <NetworkSelect
          selectedNetwork={localNetwork}
          onSelectNetwork={(network) => setLocalNetwork(network)}
        />
      </div>
      {/* Search Field */}
      <div className="flex items-center w-full">
        <input
          type="text"
          defaultValue={searchTerm}
          onChange={(e) => (searchTerm = e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Type the wallet address"
          className="bg-tycheLightGray w-full placeholder-[#444444] text-black text-sm md:text-base placeholder-[16px] md:placeholder-[20px] px-2 md:px-4 py-1 h-[40px] md:h-[54px] rounded-l-full relative z-0 pl-[140px] md:pl-[220px] focus:outline-none focus:ring-tychePrimary focus:border-tychePrimary focus:border-[1px]"
        />
        <button
          className="flex items-center justify-center h-full bg-tychePrimary font-[300] text-white text-[16px] md:text-[20px] min-w-[60px] md:min-w-[80px] px-[16px] md:px-[24px] py-[10px] md:py-[14px] tracking-wide rounded-r-[60px] right-0"
          onClick={() => handleSearch()}
        >
          <img src={searchIcon} alt="Search" className="flex w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}

// function SearchBar({ onSearch, lastSearchedAddress }) {
//   const [searchTerm, setSearchTerm] = useState("");

//   // Update the search term when lastSearchedAddress changes (for example, when set by Redux)
//   useEffect(() => {
//     if (lastSearchedAddress) {
//       setSearchTerm(lastSearchedAddress); // Set search term to pre-fill input
//     }
//   }, [lastSearchedAddress]);

//   const handleSearch = () => {
//     onSearch(searchTerm);
//   };

//   return (
//     <div className="flex">
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="Enter blockchain address"
//         className="p-2 border rounded-l flex-grow"
//       />
//       <button
//         onClick={handleSearch}
//         className="bg-tycheGreen text-white p-2 rounded-r"
//       >
//         Search
//       </button>
//     </div>
//   );
// }

export default SearchBar;
