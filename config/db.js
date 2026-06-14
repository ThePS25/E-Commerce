import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to MongoDB: ${conn.connection.host}`.bgMagenta.white);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`.bgRed.white);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};

export default connectDB;
