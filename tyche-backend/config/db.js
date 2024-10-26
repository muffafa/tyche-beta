import mongoose from "mongoose";

let isMongoDbAvailable = false;

// Connect to MongoDB
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);

		if (conn) {
			isMongoDbAvailable = true;
		}

		console.log(
			`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
		);
	} catch (err) {
		console.error(`Error: ${err.message}`.red);
		process.exit(1); // Exit process with failure
	}
};

export default connectDB;

const getMongoDbStatus = () => isMongoDbAvailable;

export { getMongoDbStatus };
