import promptModel from "../models/promptModel.js";
import configModel from "../models/configModel.js";
import OpenAI from 'openai';
import assistant from "../models/promptModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import Anthropic from '@anthropic-ai/sdk';
import FunctionModal from '../models/function.js'

const openai = new OpenAI();
const anthropic = new Anthropic({
    apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
});

const createAndEditConfig = async (req, res) => {
    try {
        req.body.userId = req.userId;
        let data;
        if (req.body.id) {
            const exists = await configModel.findOne({ userId: req.userId, _id: req.body.id });
            if (exists) {
                data = await configModel.findByIdAndUpdate({ _id: exists._id }, req.body, { new: true });
                return res.status(200).json({ data, message: "Data updated successfully." });
            }
        } else {
            data = await configModel.create(req.body);
            return res.status(200).json({ data, message: "Data created successfully." });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getConfigs = async (req, res) => {
    try {
        const data = await configModel.find({ userId: req.userId });
        res.status(200).json({ data, message: "Data created successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createAssistant = async (req, res) => {
    try {
        const { name, instructions, configId, id, twilioNumber } = req.body;
        if (!configId || !instructions || !configId || !name) {
            return res.status(404).json({ message: "name, instructions, twilioNumber and configId are required" });
        }

        if (id) {
            const exists = await promptModel.findOne({ _id: id, userId: req.userId });
            if (!exists) {
                return res.status(404).json({ message: "Assistant does't exist." });
            }
            const myAssistant = await openai.beta.assistants.update(exists.assistantId, {
                name,
                instructions,
                model: "gpt-4o-mini",
            });

            const data = await promptModel.findByIdAndUpdate({ _id: id, userId: req.userId }, { name, instructions, assistantId: myAssistant.id, configId, twilioNumber }, { new: true });
            return res.status(200).json({ data, message: "Data updated successfully." });
        }
        const myAssistant = await openai.beta.assistants.create({
            name,
            instructions,
            model: "gpt-4o-mini",
        });

        const apiKey = crypto.randomBytes(32).toString('hex');
        const data = await promptModel.create({ name, instructions, assistantId: myAssistant.id, userId: req.userId, configId, twilioNumber, apiKey })
        return res.status(200).json({ data, message: "Data created successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const findAllAssistants = async (req, res) => {
    try {
        const data = await promptModel.find({ userId: req.userId });
        res.status(200).json({ data, message: "Data fetched successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const findByNumber = async (req, res) => {
    try {
        const twilioNumber = req.params.twilioNumber;
        const data = await promptModel.findOne({ twilioNumber}).populate("function");
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const findOneAssistantById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            throw new Error("id is required");
        }
        const data = await promptModel.findOne({ _id: id, userId: req.userId }).populate("function");
        res.status(200).json({ data, message: "Data fetched successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




const cloneAssistant = async (req, res) => {
    try {
        console.log('assistant id', req.params)

        const { id } = req.params;

        console.log('assistant id', id)

        // Find the assistant to clone
        const existingAssistant = await assistant.findById(id);
        if (!existingAssistant) {
            return res.status(404).json({ message: "Assistant not found." });
        }

        // Create a new assistant document based on the existing one
        const newAssistant = new assistant({
            name: `${existingAssistant.name} copy`,
            instructions: existingAssistant.instructions,
            assistantId: existingAssistant.assistantId,
            userId: existingAssistant.userId
        });

        // Save the new assistant document
        const savedAssistant = await newAssistant.save();

        res.status(200).json({ savedAssistant, message: "Assistant cloned successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const setDefaultAssistant = async (req, res) => {
    try {
        const { assistantId } = req.body;
        const exists = await assistant.findOne({ _id: assistantId, userId: req.userId });
        if (!exists) {
            return res.status(404).json({ message: "Assistant not found." });
        }
        await assistant.updateMany({}, { $set: { isDefault: false } });
        await assistant.findByIdAndUpdate({ _id: assistantId }, { $set: { isDefault: true } });
        return res.status(200).json({ message: "Assistant updated successfully." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const useApiKey = async (req, res) => {
    try {
        const data = await promptModel.updateOne({ apiKey: req.body.apiKey }, { $set: { apiKeyUsed: true, status: true } });
        if (data.matchedCount === 0) {
            return res.status(404).json({ message: "Invalid API key." });
        }
        return res.status(200).json({ data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getAIModels = (req, res) => {
    try {
        res.json({
            data: [
                "gpt-3.5-turbo-0125",
                "gpt-4o",
                "gpt-4o-mini",
                "Claude 3 Haiku",
                "Claude 3 Opus",
                "Claude 3.5 Sonnet"
            ]
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getVoiceModels = (req, res) => {
    try {
        res.json({
            data: [
                "playHt",
                "Elevenlabs",
            ]
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getVoiceIdsByVoiceModel = (req, res) => {
    try {
        const { voiceModel } = req.query;
        let ids = [
            "playHt",
            "Elevenlabs",
        ];
        if (!ids.includes(voiceModel)) {
            return res.status(404).json({ message: "Invalid voice model" })
        }
        const playHtIds = ["s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
            "s3://voice-cloning-zero-shot/7142f297-c55f-451d-8863-108d5101b5ed/susantrainingsaad/manifest.json",
            "s3://voice-cloning-zero-shot/3a831d1f-2183-49de-b6d8-33f16b2e9867/dylansaad/manifest.json",
        ];
        const elevenLabsIds = ["21m00Tcm4TlvDq8ikWAM",
            "xoV6iGVuOGYHLWjXhVC7"
        ]

        res.json({
            data: voiceModel == "playHt" ? playHtIds : elevenLabsIds
        })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const findAllAssistantsByApiKey = async (req, res) => {
    try {
        if (!req.query.apiKey) {
            throw Error("apiKey is required")
        }
        const one = await promptModel.findOne({ apiKey: req.query.apiKey }).select("userId");
        let data = [];
        if (one) {
            data = await promptModel.find({ userId: one?.userId });
        }
        res.status(200).json({ data, message: "Data fetched successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const regenerateApiKey = async (req, res) => {
    try {
        const checkExist = await promptModel.findOne({ _id: req.body.id, userId: req.userId });
        if (!checkExist) {
            return res.status(400).json({ message: "Invalid user or not exists" });
        }
        const apiKey = crypto.randomBytes(32).toString('hex');
        await promptModel.findByIdAndUpdate(req.body.id, { apiKey });
        res.status(200).json({ apiKey })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const createFunctionConfigration = async (req, res) => {
    try {
        const { assistantId,modelToolName, description, perameter, webhook } = req.body;
        if (!assistantId || !modelToolName || !description || !perameter || !webhook ) {
            return res.status(404).json({ message: "assistantId, modelToolName, description and perameter are required" });
        }


        const dynamicParameters = perameter.map(pera => ({
            name: pera.name,
            location: "PARAMETER_LOCATION_BODY",
            Dataschema: {
                type: pera.type,
                description: pera.description
            },
            required: true
        }))
        console.log(assistantId,modelToolName,description,dynamicParameters, webhook);
        const data = await FunctionModal.create({assistant: assistantId,modelToolName,description,dynamicParameters,webhookURL: webhook})
        const assistantTable = await promptModel.findById(assistantId);
        if(assistantTable){
            assistantTable.function.push(data._id);
            await assistantTable.save();
        }

        return res.status(200).json({success: true, message: "Data created successfully.",data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export default {createFunctionConfigration, findByNumber,createAssistant, findAllAssistants, findOneAssistantById, createAndEditConfig, getConfigs, cloneAssistant, setDefaultAssistant, useApiKey, getAIModels, getVoiceModels, getVoiceIdsByVoiceModel, findAllAssistantsByApiKey, regenerateApiKey }
