import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log(`✅ DataBase Connected Successfully`)
  );
  await mongoose.connect(`${MONGO_URI}productivity`);
};

export default connectDB;
