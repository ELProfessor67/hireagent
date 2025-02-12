import mongoose from "mongoose";
const { Schema } = mongoose;

const PlanSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", PlanSchema);

export default Plan;
