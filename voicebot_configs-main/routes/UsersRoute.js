import express from "express";

const router = express.Router();
import usersController from "../controller/UsersController.js";
import verifyToken from "../middlewares/authJwt.js";

router
  .post("/login", usersController.login)
  .post("/signUp", usersController.updateEditUsers)
  .post("/editUser", verifyToken, usersController.updateEditUsers)
  .put("/updateUserStatus", verifyToken, usersController.updateUserStatus)
  .post("/sendOTP", usersController.sendOTP)
  .post("/verifyEmailOtp", usersController.verifyEmailOtp)
  .get("/getAllUsers", verifyToken, usersController.getAllUsers)
  .post("/reset/Password", usersController.Password_Set)
  .post("/project/create", usersController.create)
  // TODO Please check this code
  .get("/getUserDetails/:id", usersController.getUserDetails)
  .get("/plans", usersController.getPlans)
  .post("/updateUserPlan", verifyToken, usersController.updateUserPlan)
  .get("/load-me",verifyToken, usersController.loadUser)
export default router;
