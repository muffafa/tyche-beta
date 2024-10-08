// import { useNavigate } from "react-router-dom";
// import NetworkSelect from "./NetworkSelect";
// import SearchBar from "./SearchBar";
// import GeneralSettingsPopup from "../Popups/GeneralSettingsPopup";
// import usePopupState from "../../hooks/usePopupState";
// import tyche_abi from "../../utils/TychePremiumContractABI";
// import { ethers } from "ethers";
// import { useWeb3ModalProvider } from '@web3modal/ethers/react'
import { useNavigate } from "react-router-dom";
import tycheLogo from "../../assets/images/tyche.svg"; // logoyu svg olarak aldım png çözünürlüğü düşük
import settingsIcon from "../../assets/images/icons/settingsIcon.svg";
import SearchBar from "./SearchBar";
import { useState } from "react";
import SettingsPopup from "../Content/SettingsPopup";

//current routeninin adresine göre burası değişecek
function Header() {
  //const [lastSearchedAddress, setLastSearchedAddress] = useState("");

  // const handleSearch = (address) => {
  //   setLastSearchedAddress(address);
  //   navigate(`/${selectedNetwork.toLowerCase()}/${address}`);
  // };

  const navigate = useNavigate();
  let currentRoute = window.location.pathname;
  console.log(currentRoute);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  //check cookie for login status
  const loggedIn = document.cookie.includes("loggedIn=true");
  return (
    <>
      {currentRoute === "/search" ? (<> </>) :
      currentRoute === "/" ||
      currentRoute === "/login" ||
      currentRoute === "/register" ||
      currentRoute === "/register/username" ||
      currentRoute === "/resetPassword" ? (
        <header className="flex items-center justify-center">
          <div className="flex flex-row bg-tycheLightGray w-[915px] h-[152px] mt-[71px] rounded-[60px] items-center pl-[35px] justify-between">
            <div className="flex flex-row items-center pr-[27px] w-full justify-between">
              <div className="flex flex-row items-center cursor-pointer" onClick={() => navigate("/")}>
                <img src={tycheLogo} alt="Tyche Logo" width={96} height={96} />
                <div className="flex flex-col ml-[52px]">
                  <h1 className="text-tychePrimary text-[48px] font-[850] tracking-wide">
                    TYCHE
                  </h1>
                  <p className="text-black text-[24px] font-[310] tracking-wide">
                    TRACK YOUR ASSETS
                  </p>
                </div>
              </div>
              {currentRoute === "/" && (
                <button
                  className="flex items-center justify-center bg-tychePrimary text-white text-[24px] font-[300] w-[142px] h-[54px] tracking-wide rounded-[60px]"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </header>
      ) : (
        <header className="flex items-center justify-between mt-[71px] max-w-[915px] w-full mx-auto gap-[20px]">
          {/* Logo */}
          <button onClick={() => navigate("/")} className="flex items-center min-w-[52px] min-h-[52px] max-w-[52px] max-h-[52px]">
            <img
              src={tycheLogo}
              alt="Tyche Logo"
              
            />
          </button>

          {/* Search Bar */}
          <SearchBar />

          {/* Settings Icon */}
          <button onClick={() => setShowSettingsPopup(true)}>
            <img
              src={settingsIcon}
              alt="Settings"
              className="flex min-w-[44px] min-h-[44px]"
            />
          </button>
          {showSettingsPopup && <SettingsPopup onClose={() => setShowSettingsPopup(false)} />}


          {/* Login Button */}
          { loggedIn ? <button>
            <div className="flex items-center justify-center bg-tycheDarkGray text-black text-[20px] font-[300] w-[52px] h-[52px] p-[14px] rounded-full" onClick={() => { document.cookie = "loggedIn=false"; window.location.reload(); }}>
              <p>A</p> {/* User's first letter of the name  */}
            </div>
          </button>:
            <button
            className="flex items-center justify-center bg-tychePrimary font-[300] text-white text-[20px] px-[24px] py-[14px] tracking-wide rounded-[60px]"
            onClick={() => navigate("/login")}
          >
            <p>Login</p>
          </button>}
        </header>
      )}
    </>
  );
}




// function OLDHeader() {
//   const navigate = useNavigate();

//   // Access the selectedNetwork and walletAddress from Redux (but don't dispatch changes)
//   const storedNetwork = useSelector((state) => state.global.selectedNetwork);
//   const storedWalletAddress = useSelector(
//     (state) => state.global.walletAddress
//   );

//   const [lastSearchedAddress, setLastSearchedAddress] = useState("");
//   const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const { walletProvider } = useWeb3ModalProvider()

//   const {
//     isOpen: isSettingsOpen,
//     openPopup: openSettings,
//     closePopup: closeSettings,
//   } = usePopupState();

//   // Set initial selectedNetwork based on the Redux state (run only once on mount)
//   useEffect(() => {
//     if (storedNetwork) {
//       setSelectedNetwork(storedNetwork);
//     }
//   }, [storedNetwork]);

//   // Set initial lastSearchedAddress based on the Redux state (run only once on mount)
//   useEffect(() => {
//     if (storedWalletAddress) {
//       setLastSearchedAddress(storedWalletAddress);
//     }
//   }, [storedWalletAddress]);

//   const handleSearch = (address) => {
//     setLastSearchedAddress(address);
//     navigate(`/${selectedNetwork.toLowerCase()}/${address}`);
//   };

//   const handleNetworkSelect = (network) => {
//     setSelectedNetwork(network);
//   };

//   const handleSaveSettings = (settings) => {
//     console.log("Settings saved:", settings);
//   };

//   const handleLogoClick = () => {
//     navigate("/");
//   };
//   const handleButtonClick = async () => {
//     try {
//       const wProvider = new ethers.BrowserProvider(walletProvider);
//       const contractAddress = "0x915A0e3211C45Fc0BDF32A4c3a121ddCb0D77583";
//       const signer = await wProvider.getSigner();
//       const contract = new ethers.Contract(contractAddress, tyche_abi, signer);

//       const premiumFee = await contract.premiumFee();

//       const tx = await contract.buyPremium({ value: String(premiumFee) });

//       await tx.wait();
//       alert("Premium membership purchased successfully!");
//     } catch (error) {
//       alert("Error purchasing premium membership:", error);
//     }

//   };


//   return (
//     <header className="flex flex-wrap items-center justify-between p-4 bg-tycheWhite shadow">
//       <div
//         className="relative h-12 w-12 cursor-pointer"
//         onClick={handleLogoClick}
//       >
//         <img
//           src="/tyche.png"
//           alt="Tyche Logo"
//           className="h-full w-full object-contain"
//         />
//       </div>
//       <div className="flex-grow mx-2 min-w-0">
//         <SearchBar
//           onSearch={handleSearch}
//           lastSearchedAddress={lastSearchedAddress} // Pass Redux-stored address to SearchBar
//         />
//       </div>
//       <div className="flex items-center space-x-2 mt-2 md:mt-0">
//         <div className="hidden sm:flex items-center space-x-2">
//           <NetworkSelect
//             selectedNetwork={selectedNetwork}
//             onSelectNetwork={handleNetworkSelect}
//           />
//           <button
//             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
//             onClick={handleButtonClick}
//           >
//             Go Premium Member
//           </button>
//           <w3m-button />
//         </div>
//         <button
//           className="sm:hidden px-2 py-1 bg-tycheGray text-white rounded"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           Menu
//         </button>
//         <button
//           className="px-2 py-1 bg-tycheGray text-white rounded"
//           onClick={openSettings}
//         >
//           Settings
//         </button>
//       </div>

//       {isMenuOpen && (
//         <div className="w-full mt-2 flex flex-col space-y-2 sm:hidden">
//           <NetworkSelect
//             selectedNetwork={selectedNetwork}
//             onSelectNetwork={handleNetworkSelect}
//           />
//           <button
//             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow-lg hover:from-green-500 hover:to-blue-500 transition duration-300 ease-in-out transform hover:scale-105"
//             onClick={handleButtonClick}
//           >
//             Go Premium Member
//           </button>
//           <w3m-button />
//         </div>
//       )}

//       {isSettingsOpen && (
//         <GeneralSettingsPopup
//           settings={{ currency: "USD", timezone: "GMT+0" }}
//           onSave={handleSaveSettings}
//           onClose={closeSettings}
//         />
//       )}
//     </header>
//   );
// }

export default Header;
