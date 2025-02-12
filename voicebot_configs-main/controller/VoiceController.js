
import multer from 'multer';
import Voice from '../models/VoiceModel.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('audioFile');

// Controller for saving an audio file
export const saveAudio = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err });
    }
    
    const { llmName, gender } = req.body;
    const audioFile = req?.file?.buffer;

    try {
      const { llmName, gender } = req.body;
      const audioFile = req.file.buffer;

      const newVoice = new Voice({ llmName, gender, audioFile });
      await newVoice.save();
      res.status(200).json({ message: 'Audio file saved successfully', voice: newVoice });
    } catch (error) {
      res.status(500).json({ message: 'Error saving audio file', error: error.message });
    }
  });
};

// Controller for getting all audio files
export const getAllAudio = async (req, res) => {
  try {
    const voices = await Voice.find();
    res.status(200).json({ message: 'All voices fetched successfully.', voices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching audio files', error: error.message });
  }
};


export default {
  saveAudio, getAllAudio
};
