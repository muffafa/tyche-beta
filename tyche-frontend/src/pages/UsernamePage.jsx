import { useNavigate } from "react-router-dom";

function UsernamePage(){
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center mt-4 md:mt-[76px] px-4 md:px-0">
          <p className="text-2xl md:text-[32px] font-[350] tracking-wide text-tycheGrayBlack text-center mb-4 md:mb-[15px] max-w-[446px]">
          Last one step before using Tyche 
          </p>
          <div className="flex flex-col items-center justify-center gap-6 md:gap-[32px] px-4 md:px-[35px] py-6 md:py-[50px] bg-tycheLightGray w-full max-w-[446px] rounded-[20px]">
            <div className="flex flex-col items-start justify-between w-full gap-4 md:gap-[27px]">
              <div className="flex flex-col gap-2 md:gap-[7px] w-full">
                <p className="text-sm md:text-[16px] font-[300] text-black pl-2 md:pl-[15px]">
                    What is your Full Name?
                </p>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="h-10 md:h-[48px] pl-2 md:pl-[15px] py-1 md:py-[7px] rounded-[5px] placeholder-tycheDarkGray focus:outline-none focus:ring-tychePrimary focus:border-tychePrimary focus:border-[1px] w-full"
                />
              </div>
            </div>
            <button
                className="flex justify-center bg-tychePrimary font-[300] text-white text-lg md:text-[24px] py-2 md:py-[9px] px-4 md:px-[52px] tracking-wide rounded-[60px] w-full"
                onClick={() => navigate("/login")}
                >
                Start Using Tyche
            </button>
          </div>
        </div>
    );
}

export default UsernamePage;
