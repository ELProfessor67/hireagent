import mongoose from "mongoose";
const { Schema } = mongoose;

// Define call log schema
const callLogSchema = new Schema({
  id: { type: String, required: true },
  cost: { type: String, required: true },
  endedReason: { type: String, required: true },
  metadata: { type: String, required: true },
  assistant: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  type: { type: String, required: true },
  startedAt: { type: String, required: true },
  endedAt: { type: String, required: true },
}, { timestamps: true });

const callLog = mongoose.model('CallLog', callLogSchema);

export default callLog;
