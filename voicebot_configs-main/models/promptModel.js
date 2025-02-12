import mongoose from "mongoose";
const { Schema } = mongoose;

const promptSchema = new Schema(
    {
        name: { type: String, required: true },
        instructions: { type: String, required: true },
        assistantId: { type: String, required: true },
        userId: { type: Schema.ObjectId, required: true, res: "users" },
        configId: { type: Schema.ObjectId, required: true, res: "configs" },
        twilioNumber: { type: String },
        isDefault: { type: Boolean, default: false },
        apiKey: { type: String, default: "" },
        websiteUrl: { type: String, default: "" },
        apiKeyUsed: { type: Boolean, default: false },
        function: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "functionConfig"
            }
        ],
    },
    { timestamps: true, versionKey: false }
);

const assistant = mongoose.model("assistant", promptSchema);

export default assistant;