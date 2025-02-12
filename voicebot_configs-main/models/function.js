import mongoose from "mongoose";

const parameterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: "PARAMETER_LOCATION_BODY"
    },
    Dataschema: {
        type: {
            type: String,
            enum: ["string", "number", "boolean"],
            default: "string"
        },
        description: {
            type: String,
            required: true
        }
    },
    required: {
        type: Boolean,
        default: true
    }
});

const functionConfigSchema = new mongoose.Schema({
    assistant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assistant'
    },
    modelToolName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    dynamicParameters: [parameterSchema],
    webhookURL: {
        type: String,
        required: true
    },
    timeout: {
        type: String,
        default: "20s"
    },
    client: {}
}, { timestamps: true });

const FunctionModel = mongoose.model("functionConfig", functionConfigSchema);
export default FunctionModel;
