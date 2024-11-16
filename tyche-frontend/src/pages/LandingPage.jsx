import { useNavigate } from "react-router-dom";
import walleticon from "./../assets/images/landingWallet.svg";
import rightArrow from "./../assets/images/rightArrow.svg";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center mt-8 md:mt-[50px] px-4 md:px-0">
      <div className="flex flex-col md:flex-row w-full max-w-[915px] items-center justify-between gap-8 md:gap-[20px]">
        <div className="flex flex-col items-center md:items-start justify-center gap-6 md:gap-[50px]">
          <p className="text-2xl md:text-[36px] font-[550] text-tychePrimary text-center md:text-left">
            Tracking your moves across all chains has never been easier
          </p>
          <p className="text-lg md:text-[24px] text-black font-[350] text-center md:text-left">
            Tyche is a multi-chain, human readable and easy to use wallet
            tracking platform. Designed for the next billion coming user.
          </p>
          <div className="flex flex-row justify-center md:justify-start w-full mt-4 md:mt-[31px]">
            <button
              className="flex items-center justify-center bg-tychePrimary font-[300] text-white text-lg md:text-[24px] py-2 md:py-[9px] px-6 md:px-[52px] tracking-wide rounded-[60px]"
              onClick={() => navigate("/search")}
            >
              <div className="flex flex-row items-center gap-3 md:gap-[27px]">
                <p>Let&apos;s Explore</p>
                <img
                  src={rightArrow}
                  alt="Right Arrow"
                  className="w-4 md:w-auto"
                />
              </div>
            </button>
          </div>
        </div>
        <img
          src={walleticon}
          alt="Wallet image"
          className="w-full max-w-[300px] md:max-w-none mt-8 md:mt-0"
        />
      </div>
    </div>
  );
}

export default LandingPage;
