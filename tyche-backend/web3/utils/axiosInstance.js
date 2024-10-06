import Axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../../.env" });

const createAxiosInstance = (baseURL) => {
	return Axios.create({
		baseURL,
		headers: {
			"Content-Type": "application/json",
		},
	});
};

export default createAxiosInstance;
