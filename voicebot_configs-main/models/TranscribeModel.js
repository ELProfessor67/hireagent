import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
  role: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { _id: false });

const modelSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  messages: {
    type: [messageSchema],
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  maxTokens: {
    type: Number,
    required: true
  },
  temperature: {
    type: Number,
    required: true
  }
}, { _id: false });

const voiceSchema = new Schema({
  voiceId: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  stability: {
    type: Number,
    required: true
  },
  similarityBoost: {
    type: Number,
    required: true
  }
}, { _id: false });

const transcriberSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  }
}, { _id: false });

const TranscribeSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  model: {
    type: modelSchema,
    required: true
  },
  orgId: {
    type: String,
    required: true
  },
  voice: {
    type: voiceSchema,
    required: true
  },
  transcriber: {
    type: transcriberSchema,
    required: true
  },
  firstMessage: {
    type: String,
    required: true
  },
  clientMessages: {
    type: [String],
    required: true,
    default: []
  },
  endCallMessage: {
    type: String,
    required: true
  },
  endCallPhrases: {
    type: [String],
    required: true,
    default: []
  },
  serverMessages: {
    type: [String],
    required: true,
    default: []
  },
  recordingEnabled: {
    type: Boolean,
    required: true
  },
  voicemailMessage: {
    type: String,
    required: true
  }
}, { timestamps: true, versionKey: false });

const transcribe = mongoose.model('transcribe', TranscribeSchema);

export default transcribe;
