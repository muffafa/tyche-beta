// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
import searchIcon from "../../assets/images/icons/searchIcon.svg";
import greenEth from "../../assets/images/coin/eth.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNetwork } from "../../redux/slices/globalSlice";

function SearchBar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const storedNetwork = useSelector((state) => state.global.selectedNetwork);

  //take searchterm from window.location.pathname
  let searchTerm = window.location.pathname.split("/")[2];
  const handleSearch = () => {
    navigate("/" + storedNetwork + "/" + searchTerm);
  }
  return (
    <div className="flex items-center w-full relative">
      {/* Dropdown */}
      <div className="flex items-center h-[54px] rounded-full bg-tycheGreen p-[10px] absolute z-10">
        <img
          src={greenEth}
          alt="Ethereum"
          className="border-[4px] border-tycheWhite rounded-full"
        />
        <select className="flex items-center bg-tycheGreen text-white text-[20px] px-4 py-1 h-[54px] rounded-r-full"
        onChange={
          (e) => {
            dispatch(setNetwork(e.target.value));
          }
        }
        >
          <option value="ethereum">ethereum</option>
          <option value="sol">Solana</option>
        </select>
      </div>
      {/* Search Field */}
      <div className="flex items-center w-full">
        <input
          type="text"
          defaultValue={searchTerm}
          onChange={(e) => searchTerm = e.target.value}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Wallet address or tx hash"
          className="bg-tycheBeige w-full text-tycheGray placeholder-gray-500 placeholder-[20px] px-4 py-1 h-[54px] rounded-l-full relative z-0 pl-[210px]"
        />
        <button
          className="flex items-center justify-center h-full  bg-tycheGreen font-[300] text-white text-[20px] min-w-[80px] px-[24px] py-[14px] tracking-wide rounded-r-[60px] right-0"
          onClick={() => handleSearch()}
        >
          <img src={searchIcon} alt="Search" className="flex" />
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

// SearchBar.propTypes = {
//   onSearch: PropTypes.func.isRequired,
//   lastSearchedAddress: PropTypes.string,
// };

export default SearchBar;
