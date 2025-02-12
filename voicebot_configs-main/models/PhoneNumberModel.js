import mongoose from "mongoose";
const { Schema, Types } = mongoose;

const TwilioSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'users', required: [true, "User id is required"] },
twilioPhoneNumber: {type: String, require: [true, "Twilio phone number is required"]},
twilioAccountSID: {type: String, require: [true, "Twilio account SID is required"]},
twilioAuthToken: {type: String, require: [true, "Twilio auth token is required"]},
twilioLabel: {type: String, require: [true, "Label is required"]},
}, {timestamps: true})


const phoneNumbers = mongoose.model("phoneNumbers", TwilioSchema)

export default phoneNumbers