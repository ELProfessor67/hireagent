import phoneNumbers from "../models/PhoneNumberModel.js";


// Saving twilio number into db

const saveTwilioNumber = async(req, res) => {
  try {
    const twilioInfo = req.body;

    const result = await phoneNumbers.create(twilioInfo)
    console.log('twilio', result)
    res.status(200).json({ result, message: "Twilio number saved successfully."})
    
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const PhoneNumberControllers = {
  saveTwilioNumber
}