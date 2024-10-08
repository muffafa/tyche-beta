import { useNavigate } from "react-router-dom";
import walleticon from "./../assets/images/landingWallet.svg";
import rightArrow from "./../assets/images/rightArrow.svg";
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center mt-[81px]">
      <div className="flex flex-row w-[915px] items-center justify-between gap-[20px]">
        <div className="flex flex-col items-center justify-center gap-[50px]">
          <p className="text-[36px] font-[550] text-tychePrimary">
            Tracking your moves across all chains has never been easier
          </p>
          <p className="text-[24px] text-black font-[350]">
            Tyche is a multi-chain, human readable and easy to use wallet tracking platform. Designed for the next billion coming user.
          </p>
          <div className="flex flex-row justify-start w-full mt-[31px]">
            <button className="flex items-center justify-center bg-tychePrimary font-[300] text-white text-[24px] py-[9px] px-[52px] tracking-wide rounded-[60px]" onClick={() => navigate("/search")}>
              <div className="flex flex-row items-center gap-[27px]">
                <p>Lets Explore</p>
                <img src={rightArrow} alt="Right Arrow" />
              </div>
            </button>
          </div>
        </div>
        <img src={walleticon} alt="Wallet image" />
      </div>
    </div>
  );
}

export default LandingPage;
