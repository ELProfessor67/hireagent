import callLog from "../models/CallLogModel.js";



export const saveCallLog = async (req, res) => {
  const { id, cost, endedReason, metadata, assistant, phoneNumber, type, startedAt, endedAt } = req.body;

  try {
    const newCallLog = new callLog({
      id,
      cost,
      endedReason,
      metadata,
      assistant,
      phoneNumber,
      type,
      startedAt,
      endedAt,
    });
    
    await newCallLog.save();
    res.status(201).json({ message: 'Call log saved successfully', callLog: newCallLog });
  } catch (error) {
    res.status(500).json({ message: 'Error saving call log', error: error.message });
  }
};

// Controller for getting all call logs
export const getAllCallLogs = async (req, res) => {
  try {
    const callLogs = await callLog.find();
    res.status(200).json(callLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching call logs', error: error.message });
  }
};




export default {
  saveCallLog, getAllCallLogs
}