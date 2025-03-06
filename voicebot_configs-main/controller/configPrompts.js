import promptModel from "../models/promptModel.js";
import configModel from "../models/configModel.js";
import OpenAI from 'openai';
import assistant from "../models/promptModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import Anthropic from '@anthropic-ai/sdk';
import FunctionModal from '../models/function.js'
import UserModel from "../models/UsersModel.js";



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
        const { name, instructions, configId, id, firstFiller, twilioNumber, description, language, placeholders, type, price } = req.body;
        if (!configId || !instructions || !configId || !name) {
            return res.status(404).json({ message: "name, instructions and configId are required" });
        }

        if (id) {
            const exists = await promptModel.findOne({ _id: id, userId: req.userId });
            if (!exists) {
                return res.status(404).json({ message: "Assistant does't exist." });
            }
            // const myAssistant = await openai.beta.assistants.update(exists.assistantId, {
            //     name,
            //     instructions,
            //     model: "gpt-4o-mini",
            // });

            const data = await promptModel.findByIdAndUpdate({ _id: id, userId: req.userId }, { name, instructions, assistantId: "test", configId, firstFiller, twilioNumber, placeholders }, { new: true });
            return res.status(200).json({ data, message: "Data updated successfully." });
        }
        // const myAssistant = await openai.beta.assistants.create({
        //     name,
        //     instructions,
        //     model: "gpt-4o-mini",
        // });

        const apiKey = crypto.randomBytes(32).toString('hex');
        const data = await promptModel.create({ name, instructions, assistantId: "test", userId: req.userId, configId, apiKey, description, language, type, price })
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


const findAllPublishAssistants = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const search = req.query.search || "";
        const limit = 10;

        const skip = limit * (page - 1);

        const query = {
            type: "service",
            isPublish: true,
            name: { $regex: search, $options: "i" }, // Case-insensitive search
        };
        const data = await promptModel.find(query).skip(skip).limit(limit);

        const totalDocument = await promptModel.countDocuments(query);
        const totalPage = Math.ceil(totalDocument / limit);
        res.status(200).json({ data, message: "Data fetched successfully.", totalPage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const findByNumber = async (req, res) => {
    try {
        const twilioNumber = req.params.twilioNumber;
        const data = await promptModel.findOne({ twilioNumber }).populate("function");
        const user = await UserModel.findById(data.userId);
    
        if(data.price > user.credits && data.type == "purchased"){
            res.status(200).json({ creditsEnd: true, message: "No Credits Left to make a call." });
            return
        }

        res.status(200).json({ data,creditsEnd: false });
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
        const data = await promptModel.findOne({ _id: id }).populate("function");
        res.status(200).json({ data, message: "Data fetched successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const findOneAssistantCallServerById = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            throw new Error("id is required");
        }
        const data = await promptModel.findOne({ _id: id }).populate("function");
        const user = await UserModel.findById(data.userId);

        if(data.price > user.credits && data.type == "purchased"){
            res.status(200).json({ creditsEnd: true, message: "No Credits Left to make a call." });
        }

        res.status(200).json({ data, message: "Data fetched successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const cutCredits = async (req, res) => {
    try {
        const userId = req.body.user_id;
        const assistantId = req.body.assistant_id;

        const user = await UserModel.findById(userId);
        const assistant = await promptModel.findById(assistantId);

        const pricePerMin = assistant.price;
        if(user.credits < pricePerMin){
            res.status(401).json({creditsEnd: true,message: "No More credits Left"});
        }

        user.credits -= pricePerMin;
        await user.save();
        console.log("cut credits",user.credits)
        

        res.status(200).json({message: "Cut Successfully",creditsEnd: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const publishAssistant = async (req, res) => {
    try {
        const { id, value } = req.body;
        if (!id) {
            throw new Error("id is required");
        }

        const data = await promptModel.findOne({ _id: id, userId: req.userId })
        data.isPublish = value;
        await data.save();

        res.status(200).json({ data, message: "Status Changed Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const buyAssistant = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body;
        const serviceAssistant = await promptModel.findOne({ _id: id });

        if (!serviceAssistant) {
            return res.status(404).json({ message: "Assistant does't exist." });
        }
        const config = await configModel.create({
            fillers: ["Great"],
            voiceId:
                "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
            firstFiller: serviceAssistant.firstFiller,
            audioSpeed: "0.9",
            informationNeeded: "",
            userId
        });

        const placeholders = serviceAssistant.placeholders.map(p => ({...p,value: ""}));
        const apiKey = crypto.randomBytes(32).toString('hex');

        

        const purchasedAssistant = await promptModel.create({
            name: serviceAssistant.name,
            instructions: serviceAssistant.instructions,
            userId,
            configId: config._id,
            apiKey,
            language: serviceAssistant.language,
            type: "purchased",
            price: serviceAssistant.price,
            soldBy: serviceAssistant.userId,
            placeholders,
            firstFiller: serviceAssistant.firstFiller
        });


        serviceAssistant.purchaseCount += 1;
        await serviceAssistant.save();

        return res.status(200).json({ data: purchasedAssistant, message: "Purchased Successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
        const { assistantId, modelToolName, description, perameter, webhook } = req.body;
        if (!assistantId || !modelToolName || !description || !perameter || !webhook) {
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
        console.log(assistantId, modelToolName, description, dynamicParameters, webhook);
        const data = await FunctionModal.create({ assistant: assistantId, modelToolName, description, dynamicParameters, webhookURL: webhook })
        const assistantTable = await promptModel.findById(assistantId);
        if (assistantTable) {
            assistantTable.function.push(data._id);
            await assistantTable.save();
        }

        return res.status(200).json({ success: true, message: "Data created successfully.", data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export default { createFunctionConfigration, findByNumber, createAssistant, findAllAssistants, findOneAssistantById, createAndEditConfig, getConfigs, cloneAssistant, setDefaultAssistant, useApiKey, getAIModels, getVoiceModels, getVoiceIdsByVoiceModel, findAllAssistantsByApiKey, regenerateApiKey, publishAssistant, findAllPublishAssistants, buyAssistant , cutCredits, findOneAssistantCallServerById}
