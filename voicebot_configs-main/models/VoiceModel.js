import mongoose from 'mongoose';
const { Schema } = mongoose;

const VoiceSchema = new Schema({
  llmName: { type: String, required: true },
  gender: { type: String, required: true, enum: ['all', 'male', 'female', 'neutral'] },
  audioFile: { type: Buffer, required: true }, 
}, { timestamps: true });

const Voice = mongoose.model('Voice', VoiceSchema);

export default Voice;
