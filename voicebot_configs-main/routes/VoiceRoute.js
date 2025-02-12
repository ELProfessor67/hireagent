import express from "express";
const router = express.Router();

import VoiceController from '../controller/VoiceController.js'

router.post('/saveAudio', VoiceController.saveAudio);
router.get('/getAllAudio', VoiceController.getAllAudio);

export default router;