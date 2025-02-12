import mongoose from "mongoose";
const { Schema } = mongoose;

// Define call log schema
const masterSchema = new Schema(
    {
        code: String,
        key: String,
        value: String,
        apiKey: String,
        userId: String,
        parentId: mongoose.Types.ObjectId,
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const master = mongoose.model("master", masterSchema);

export default master;
