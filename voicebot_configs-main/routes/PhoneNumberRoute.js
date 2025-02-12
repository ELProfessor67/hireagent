import express from "express"
import verifyToken from "../middlewares/authJwt.js";
import { PhoneNumberControllers } from "../controller/PhoneNumberController.js";


const router = express.Router()


router.post("/save-twilio-number",  PhoneNumberControllers.saveTwilioNumber)

export const PhoneNumberRoutes = router;