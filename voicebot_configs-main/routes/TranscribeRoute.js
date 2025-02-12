import express from "express";
const router = express.Router();
import TranscriberController from '../controller/TranscribeController.js'

// Save a new transcriber
router.post('/saveTranscriber', TranscriberController.saveTranscriber);

// Get all transcribers
router.get('/getallTranscriber', TranscriberController.getAllTranscribers);

// Get one transcriber by ID
router.get('/getTranscriberById/:id', TranscriberController.getTranscriberById);

export default router;





