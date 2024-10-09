import { useNavigate } from "react-router-dom";

function UsernamePage(){
    const navigate = useNavigate();
    return (
        <>
        <div className="flex flex-col items-center justify-center mt-[76px] gap-[15px]">
          <p className="text-[32px] font-[350] tracking-wide text-tycheGrayBlack w-[446px] text-center">
          Last one step before using Tyche 
          </p>
          <div className="flex flex-col items-center justify-center gap-[32px] px-[35px] py-[50px] bg-tycheLightGray w-[446px] rounded-[20px]">
            <div className="flex flex-col items-start justify-between w-full gap-[27px]">
              <div className="flex flex-col gap-[7px] w-full">
                <p className="text-[16px] font-[300] text-black pl-[15px]">
                    What is your Full Name?
                </p>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="h-[48px] pl-[15px] py-[7px] rounded-[5px] placeholder-tycheDarkGray focus:outline-none focus:ring-tychePrimary focus:border-tychePrimary focus:border-[1px]"
                />
              </div>
            </div>
            <button
                className="flex justify-center bg-tychePrimary font-[300] text-white text-[24px] py-[9px] px-[52px] tracking-wide rounded-[60px] w-full"
                onClick={() => navigate("/login")}
                >
                Start Using Tyche
            </button>
          </div>
        </div>
        </>
      );
}

export default UsernamePage;