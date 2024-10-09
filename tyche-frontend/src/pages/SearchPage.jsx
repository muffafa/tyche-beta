import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Header/SearchBar";
import tycheLogo from "./../assets/images/tyche.svg";

function SearchPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen mx-auto gap-[25px]">
        {/* Logo */}
        <button onClick={() => navigate("/")}>
          <img
            src={tycheLogo}
            alt="Tyche Logo"
            width={96}
            height={96}
          />
        </button>
        <div className="flex flex-col text-center gap-[25px]">
          <h1 className="text-tychePrimary text-[48px] font-[850] tracking-wide">
            TYCHE
          </h1>
          <p className="text-black text-[24px] font-[310] tracking-wide">
            TRACK YOUR ASSETS
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-[915px]">
          <SearchBar
            onSearch={(searchTerm) => navigate("/transaction/" + searchTerm)}
          />
        </div>
      </div>
    </>
  );
}

export default SearchPage;
