import express from "express";
import configsPromptController from "../controller/configPrompts.js";
import verifyToken from "../middlewares/authJwt.js"

const router = express.Router();

router
    .post("/createAssistant", verifyToken, configsPromptController.createAssistant)
    .post("/update-status", verifyToken, configsPromptController.publishAssistant)
    .post("/create-function", verifyToken, configsPromptController.createFunctionConfigration)
    .get("/find-by-number/:twilioNumber", configsPromptController.findByNumber)
    .get("/findAllAssistants", verifyToken, configsPromptController.findAllAssistants)
    .post("/cut-credits", configsPromptController.cutCredits)
    .get("/get-publish-assistant", configsPromptController.findAllPublishAssistants)
    .post("/buy-assistant", verifyToken,configsPromptController.buyAssistant)
    .get("/findAllAssistantsByApiKey", configsPromptController.findAllAssistantsByApiKey)
    .get("/findOneAssistantById", configsPromptController.findOneAssistantById)
    .get("/find-assistant-by-id", configsPromptController.findOneAssistantCallServerById)
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
