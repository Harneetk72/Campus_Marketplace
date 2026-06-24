import mongoose from "mongoose";

export const db = async () => {
  try {
   await mongoose.connect(process.env.MONGO_url);
    console.log("database connected");
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};
