import express from "express";
import configsPromptController from "../controller/configPrompts.js";
import verifyToken from "../middlewares/authJwt.js"

const router = express.Router();

router
    .post("/createAssistant", verifyToken, configsPromptController.createAssistant)
    .post("/create-function", verifyToken, configsPromptController.createFunctionConfigration)
    .get("/find-by-number/:twilioNumber", configsPromptController.findByNumber)
    .get("/findAllAssistants", verifyToken, configsPromptController.findAllAssistants)
    .get("/findAllAssistantsByApiKey", configsPromptController.findAllAssistantsByApiKey)
    .get("/findOneAssistantById", verifyToken, configsPromptController.findOneAssistantById)
    .post("/createAndEditConfig", verifyToken, configsPromptController.createAndEditConfig)
    .get("/getConfigs", verifyToken, configsPromptController.getConfigs)
    .post("/saveCloneAssistant/:id", verifyToken, configsPromptController.cloneAssistant)
    .put("/setDefaultAssistant", verifyToken, configsPromptController.setDefaultAssistant)
    .post("/useApiKey", configsPromptController.useApiKey)
    .get("/getAIModels", configsPromptController.getAIModels)
    .get("/getVoiceModels", configsPromptController.getVoiceModels)
    .get("/getVoiceIdsByVoiceModel", configsPromptController.getVoiceIdsByVoiceModel)
    .post("/regenerateApiKey", verifyToken, configsPromptController.regenerateApiKey);

export default router;
