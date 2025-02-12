import mongoose from "mongoose";
import Plan from "../models/PlanModel.js";
import dotenv from "dotenv";
dotenv.config();

const plans = [
  {
    id: "month",
    name: "1 Month",
    price: 100,
    discountPercentage: 0,
    duration: 30,
  },
  {
    id: "3month",
    name: "3 Months",
    price: 100 * 3,
    discountPercentage: 3,
    duration: 90,
  },
  {
    id: "6month",
    name: "6 Months",
    price: 100 * 6,
    discountPercentage: 6,
    duration: 180,
  },
  {
    id: "year",
    name: "1 Year",
    price: 100 * 12,
    discountPercentage: 10,
    duration: 365,
  },
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const populatePlans = async () => {
  try {
    await Plan.deleteMany();
    await Plan.insertMany(plans);
    console.log("Plans inserted successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting plans:", error);
    mongoose.connection.close();
  }
};

populatePlans();
