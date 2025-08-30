import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbConnect = async () => {
  
  try {
  await mongoose.connect(process.env.MONGO_URI);
    console.log("( O ) Database Connected Successfully");
  } catch (error) {
    console.error(" ( X )Error connecting to database:", error);
  }
};
export default dbConnect;
