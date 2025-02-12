import express from "express";
const router = express.Router();
import CallLogController from '../controller/CallLogController.js'


router.get("/getCallLogs", CallLogController.getAllCallLogs)
router.post('/saveCallLog', CallLogController.saveCallLog);


export default router;
