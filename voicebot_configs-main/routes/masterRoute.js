import express from "express";
import controller from "../controller/masterController.js";

const router = express.Router();

router
    .post("/add", controller.addMasterData)
    .get("/find", controller.getMasterDataByName)

export default router;