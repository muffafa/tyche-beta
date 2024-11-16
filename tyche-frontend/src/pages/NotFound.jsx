import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import notFoundImage from "../assets/images/notFound.svg";
import rightArrow from "../assets/images/rightArrow.svg";

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/notFound");
  }
  , []);
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center mt-16 justify-center flex flex-col items-center gap-6">
      
        <h1 className="text-tychePrimary text-4xl font-bold">
          404 - Page Not Found
        </h1>
        <p className="">
          Sorry, the page you are looking for does not exist.
        </p>
        <img src={notFoundImage} alt="Not Found" className="w-48 h-48" />
        <div className="flex flex-row justify-center md:justify-start w-full">
            <button
              className="flex items-center justify-center bg-tychePrimary font-[300] text-white text-lg md:text-[24px] py-2 md:py-[9px] px-6 md:px-[52px] tracking-wide rounded-[60px]"
              onClick={() => navigate("/")}
            >
              <div className="flex flex-row items-center gap-3 md:gap-[27px]">
                <p>Go back to the homepage</p>
                <img
                  src={rightArrow}
                  alt="Right Arrow"
                  className="w-4 md:w-auto"
                />
              </div>
            </button>
          </div>
      </div>
    </div>

  );
}

export default NotFound;
