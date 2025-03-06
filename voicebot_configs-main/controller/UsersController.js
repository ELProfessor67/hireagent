import users from "../models/UsersModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpModel from "../models/otpModel.js";
import otpGenerator from "otp-generator";
import transporter from "../utils/mail-transporter.js";
import projectModel from "../models/project.js";
import Plan from "../models/PlanModel.js";
const JWT_SECERET = process.env.JWT_SECERET;

const updateEditUsers = async (req, res, next) => {
  try {
    let id = req.body._id;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const dataToSave = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      state: req.body.state,
      city: req.body.city,
      role: req.body.role || "user",
      status: req.body.status,
      password: hashedPassword,
    };

    let data = await users.findOne({ _id: req.body._id });

    if (data) {
      const updatedData = await users.findByIdAndUpdate(id, {
        $set: dataToSave,
      });
      return res.status(200).json({ messgae: "users updated" });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = new users(dataToSave);
    await newUser.save();
    res.send({ message: "New Users Stored." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ messgae: "An error Occoured", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "Please try to login with correct credentials",
      });
    }
    const verifyPassword = await comparePasswordAsync(password, user.password);

    if (!verifyPassword) {
      return res
        .status(400)
        .json({ status: "400", message: "Incorrect Password" });
    }

    const authToken = jwt.sign({ userId: user.id }, JWT_SECERET, {
      expiresIn: 86400, // 24 hours
    });

    const profile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      state: user.state,
      city: user.city,
      address: user.address, // added
      companyName: user.companyName, // added
      firstName: user.firstName, // added
      lastName: user.lastName, // added
      managerName: user.managerName, // added
      pincode: user.pincode, // added
      website: user.website, // added
      profileImage: user.profileImage,
      phoneNumber: user.phoneNumber, //added,
      credits: user.credits,
    };
    return res.json({ authToken, profile });
  } catch (err) {
    res.status(400).json({ messgae: err.message });
  }
};

const handleVerifyOTP = async (req, res) => {
  try {
    const user = await users.findOne({ email: req.session.email });
    if (!user) {
      return res.status(401).send({ message: "User not found." });
    }
    if (req.body.otp === req.session.otp) {
      delete req.session.otp;
      delete req.session.email;
      user.isVerified = true;
      await user.save();
      const token = jwt.sign({ userId: user._id }, JWT_SECERET);
      res.send({ token });
    } else {
      res.status(401).send({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error verifying OTP." });
  }
};

const updateUserStatus = async (req, res, next) => {
  try {
    await users.findByIdAndUpdate(
      { _id: req.body.id },
      { status: req.body.status }
    );
    return res
      .status(200)
      .json({ message: "User status updated successfully." });
  } catch (error) {
    res.status(400).json({ messgae: error.message });
  }
};

//sending otp to email

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(403).json({
        success: false,
        message: "Email is required",
      });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    await new otpModel({ email, otp }).save();

    let info = await transporter.sendMail({
      from: "propertyp247@gmail.com",
      to: [email, "dpundir72@gmail.com"],
      subject: "Verification Email",
      html: `
            <div
              style="max-width: 90%; margin: auto; padding-top: 20px;"
            >
              <br/>
              <span style="font-weight:800; display:block;">${otp} is your verification code for grest.com .</span>
            </div>
          `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(403).json({
        success: false,
        message: "Email and otp fields are required",
      });
    }

    const response = await otpModel
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    } else {
      await otpModel.deleteOne({ _id: response[0]._id });

      return res.status(200).json({
        success: true,
        message: "Verified",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const comparePasswordAsync = async function (candidatePassword, pass) {
  if (!pass) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(candidatePassword, pass);
};

const getAllUsers = async (req, res) => {
  try {
    const data = await users.find({}).select("email name");
    res.status(200).json({ data, message: "Users fetched successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//set password

const Password_Set = async (req, res) => {
  try {
    let { email, newPassword } = req.body;

    let user = await users.findOne({ email: email });
    if (!user) {
      return res.status(400).send("User not found.");
    }

    let hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.send("Your password has been reset.");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while resetting the password.");
  }
};

const create = async (req, res) => {
  const a = await projectModel.create(req.body);
  res.status(200).json({ success: true, data: a });
};

// Get user details according to schema not json data
// TODO Please check this code

const getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await users.findById(id);
    res
      .status(200)
      .json({ result, message: "User details fetched successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.status(200).json({ plans, message: "Plans fetched successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserPlan = async (req, res) => {
  const { id, planId } = req.body;
  try {
    const user = await users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    user.selectedPlan = {
      planId: plan._id,
      name: plan.name,
      price: plan.price,
      discountPercentage: plan.discountPercentage,
      duration: plan.duration,
      expiryDate: expiryDate,
    };
    await user.save();

    res
      .status(200)
      .json({ message: "Plan updated successfully", plan: user.selectedPlan });
  } catch (error) {
    console.error("Error updating user plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const loadUser = async (req, res) => { 
  try {
    const id = req.userId;
    const user = await users.findById(id);
    res
      .status(200)
      .json(user);
  } catch (error) {
    console.error("Error updating user plan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export default {
  handleVerifyOTP,
  updateEditUsers,
  login,
  updateUserStatus,
  sendOTP,
  verifyEmailOtp,
  getAllUsers,
  Password_Set,
  create,
  getUserDetails,
  getPlans,
  updateUserPlan,
  loadUser
};
