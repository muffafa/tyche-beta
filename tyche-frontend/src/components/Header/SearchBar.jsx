import { useState } from "react";
import PropTypes from "prop-types";

function SearchBar({ onSearch, lastSearchedAddress }) {
  const [searchTerm, setSearchTerm] = useState(lastSearchedAddress || "");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="search-bar flex">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter blockchain address"
        className="p-2 border rounded-l"
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
