import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Header/SearchBar";
import tycheLogo from "./../assets/images/tyche.svg";

function SearchPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 md:py-0">
      <div className="w-full max-w-[915px] flex flex-col items-center justify-center gap-6 md:gap-[25px]">
        {/* Logo */}
        <button onClick={() => navigate("/")} className="mb-2 md:mb-0">
          <img
            src={tycheLogo}
            alt="Tyche Logo"
            className="w-20 h-20 md:w-24 md:h-24"
          />
        </button>
        <div className="flex flex-col text-center gap-4 md:gap-[25px]">
          <h1 className="text-tychePrimary text-3xl md:text-[48px] font-[850] tracking-wide">
            TYCHE
          </h1>
          <p className="text-black text-lg md:text-[24px] font-[310] tracking-wide">
            TRACK YOUR ASSETS
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
