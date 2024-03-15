import mongoose from "mongoose";
const URI = process.env.MONGO_URI;

if (!URI) {
  console.log("Please provide a Mongodb URI");
  process.exit(1);
}

export const initDB = async () => {
  try {
    await mongoose.connect(URI, { dbName: "paytm" }).then((res) => {
      console.log("Database connected");
    });
  } catch (error) {
    console.log("Error connecting to Database" + error);
  }
};
