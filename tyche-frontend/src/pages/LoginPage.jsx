import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import useCustomAxios from "../hooks/useCustomAxios";
import { loginUser } from "./../redux/slices/userSlice";
import { addAddress, deleteAllAddresses } from "./../redux/slices/walletSlice";
import { useDispatch } from "react-redux";

function LoginPage() {
  const navigate = useNavigate();
  const axios = useCustomAxios();
  const dispatch = useDispatch();
  
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
      try {
        const response = await axios.post("api/v1/auth/login", {
          email: values.email,
          password: values.password,
        });
        const data = response.data;
        
        if (data.success !== true) {
          throw new Error(data.message);
        } else {
          localStorage.setItem("token", data.token);
          const userData = await axios.get("/api/v1/auth/me");
          //console.log("User data:", userData.data);
          dispatch(loginUser({
            fullname: userData.data.data.fullname,
            email: userData.data.data.email, 
            wallets: userData.data.wallets,
            preferredCurrency: userData.data.data.preferredCurrency
          }));
          dispatch(deleteAllAddresses()); // Clear all addresses before adding new ones

          userData.data.wallets.map(wallet => {
            return {
              id: wallet._id,
              network: wallet.network,
              address: wallet.address,
              tag: wallet.nickname
            }
          }).forEach(wallet => dispatch(addAddress(wallet)));
          
          //console.log("Current user after dispatch:", currentUser);

          console.log("Login success:", userData.data);
          navigate("/search");
        }
      } catch (error) {
        console.error("Login failed:", error);
        alert(
          "Login failed: " + (error.response?.data?.message || error.message)
        );
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center mt-4 md:mt-[45px] px-4 md:px-0">
      <p className="text-2xl md:text-[32px] font-[350] tracking-wide text-tycheGrayBlack text-center mb-4 md:mb-[15px]">
        Sign in to Tyche
      </p>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col items-center justify-center gap-[12px] px-4 md:px-[35px] py-6 md:py-[50px] bg-tycheLightGray w-full max-w-[443px] rounded-[20px]">
          <div className="flex flex-col items-start justify-between w-full gap-4 md:gap-[27px]">
            <div className="flex flex-col gap-2 md:gap-[7px] w-full">
              <p className="text-sm md:text-[16px] font-[300] text-black pl-2 md:pl-[15px]">
                Email
              </p>
              <input
                name="email"
                type="email"
                required
                placeholder="Your e-mail address..."
                onChange={formik.handleChange}
                value={formik.values.email}
                className="h-10 md:h-[48px] pl-2 md:pl-[15px] py-1 md:py-[7px] rounded-[5px] placeholder-tycheDarkGray focus:outline-none focus:ring-tychePrimary focus:border-tychePrimary focus:border-[1px] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-[7px] w-full">
              <p className="text-sm md:text-[16px] font-[300] text-black pl-2 md:pl-[15px]">
                Password
              </p>
              <input
                name="password"
                type="password"
                required
                placeholder="Your password..."
                onChange={formik.handleChange}
                value={formik.values.password}
                className="h-10 md:h-[48px] pl-2 md:pl-[15px] py-1 md:py-[7px] rounded-[5px] placeholder-tycheDarkGray focus:outline-none focus:ring-tychePrimary focus:border-tychePrimary focus:border-[1px] w-full"
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-between w-full gap-4 md:gap-[32px] mt-4">
            <div className="flex flex-row items-start justify-between w-full">
              <p className="text-sm md:text-[16px] font-bold text-tycheBlue cursor-pointer" onClick={() => navigate("/register")}>
                Create Account
              </p>
              <p className="text-sm md:text-[16px] font-bold text-tycheBlue cursor-pointer" onClick={() => navigate("/resetPassword")}>
                Reset Password
              </p>
            </div>
            <button
              className="flex items-center justify-center bg-tychePrimary font-[300] text-white text-lg md:text-[24px] py-2 md:py-[9px] px-4 md:px-[52px] tracking-wide rounded-[60px] w-full"
              type="submit"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;