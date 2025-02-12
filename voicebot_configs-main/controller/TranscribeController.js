import transcribe from "../models/TranscribeModel.js";


// Save a new transcriber
const saveTranscriber = async (req, res) => {
    try {
        const {
            id, name, model, orgId, voice, transcriber,
            firstMessage, clientMessages, endCallMessage,
            endCallPhrases, serverMessages, recordingEnabled, voicemailMessage
        } = req.body;

        if (!id || !name || !model || !orgId || !voice || !transcriber || !firstMessage || !endCallMessage || !recordingEnabled || !voicemailMessage) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const newTranscriber = new transcribe({
            id, name, model, orgId, voice, transcriber,
            firstMessage, clientMessages, endCallMessage,
            endCallPhrases, serverMessages, recordingEnabled, voicemailMessage
        });

        const savedTranscriber = await newTranscriber.save();
        res.status(200).json({ savedTranscriber, message: "Transcriber saved successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all transcribers
const getAllTranscribers = async (req, res) => {
    try {
        const transcribers = await transcribe.find();
        res.status(200).json({transcribers, message: "All Transcribe fetched successfully."});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get one transcriber by ID
const getTranscriberById = async (req, res) => {
    try {
        const transcriber = await transcribe.findById(req.params.id);
        if (!transcriber) {
            return res.status(404).json({ message: "Transcriber not found." });
        }
        res.status(200).json({transcriber, message: "Transcribe fetched successfully."});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export default {
  saveTranscriber, getAllTranscribers, getTranscriberById
}