import mongoose from "mongoose";
const { Schema } = mongoose;

const configSchema = new Schema(
    {
        aiModels: { type: String },
        fillers: { type: Array },
        voiceId: { type: String, required: true },
        firstFiller: { type: String, required: true },
        audioSpeed: { type: Schema.Types.Decimal128, required: true },
        userId: { type: Schema.ObjectId, required: true, res: "users" },
        interruptionWorldsCounts: { type: Number, default: 0 },
        aiModel: { type: String, default: "" },
        informationNeeded: { type: String, default: "" },
    },
    { timestamps: true, versionKey: false }
);

const config = mongoose.model("config", configSchema);

export default config;