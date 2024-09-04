import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function SearchBar({ onSearch, lastSearchedAddress }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Update the search term when lastSearchedAddress changes (for example, when set by Redux)
  useEffect(() => {
    if (lastSearchedAddress) {
      setSearchTerm(lastSearchedAddress); // Set search term to pre-fill input
    }
  }, [lastSearchedAddress]);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter blockchain address"
        className="p-2 border rounded-l flex-grow"
      />
      <button
        onClick={handleSearch}
        className="bg-tycheGreen text-white p-2 rounded-r"
      >
        Search
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  lastSearchedAddress: PropTypes.string,
};

export default SearchBar;
