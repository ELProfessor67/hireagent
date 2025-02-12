import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true, versionKey: false }
);


const project = mongoose.model("project", projectSchema);

export default project;