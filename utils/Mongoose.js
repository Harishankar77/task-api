import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/todo`);
    console.log(`DB is Connected :)`);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
