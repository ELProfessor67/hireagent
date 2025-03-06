import mongoose from "mongoose";
import { type } from "os";
const { Schema } = mongoose;

const promptSchema = new Schema(
    {
        firstFiller: { type: String, required: false,default: "" },
        name: { type: String, required: true },
        instructions: { type: String, required: true },
        assistantId: { type: String, required: false },
        userId: { type: Schema.ObjectId, required: true, res: "users" },
        configId: { type: Schema.ObjectId, required: true, res: "configs" },
        twilioNumber: { type: String, default: undefined },
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
        type: {type: String,enum: ["service","purchased"]},
        description: {type: String, default: undefined},
        language: {type: String, default: undefined},
        soldBy: {type: mongoose.ObjectId, ref: "users", default: undefined},
        placeholders: [
            {
                key: {type: String},
                value: {type: String}
            }
        ],
        isPublish: {type: Boolean, default: false},
        price: {type: Number, default: 0.1},
        purchaseCount: {type: Number, default: 0},
    },
    { timestamps: true, versionKey: false },
);

const assistant = mongoose.model("assistant", promptSchema);

export default assistant;