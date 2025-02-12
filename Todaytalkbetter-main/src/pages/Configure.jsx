import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import {BACKEND_BASE_URL} from '../constant/URL'

const Configuration = () => {
  const [firstFiller, setFirstFiller] = useState("");
  const [voiceId, setVoiceId] = useState("");
  const [audioSpeed, setAudioSpeed] = useState(1);
  const [fillers, setFillers] = useState([]);
  const [aiModels, setAiModels] = useState([]);
  const [selectedAiModel, setSelectedAiModel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          return;
        }

        const response = await axios.get(`${BACKEND_BASE_URL}/api/configs/getConfigs`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        const data = response.data.data;
        setFirstFiller(data.firstFiller);
        setVoiceId(data.voiceId[0]);
        setAudioSpeed(parseFloat(data.audioSpeed?.$numberDecimal));
        setFillers(data.fillers);
        setAiModels(data.aiModels);
        setSelectedAiModel(data.aiModels[0]?.name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        return;
      }

      const configData = {
        fillers,
        voiceId,
        firstFiller,
        audioSpeed: audioSpeed.toString(),
      };

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/configs/createAndEditConfig`,
        configData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Post success:", response.data);
    } catch (error) {
      console.error("Error posting configuration:", error);
    }
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleAudioSpeedChange = (event) => {
    setAudioSpeed(parseFloat(event.target.value));
  };

  const handleTagChange = (newTags) => {
    setFillers(newTags);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-zinc-800 text-white font-sans h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-5">
          <div className="flex items-center justify-center space-x-4">
            <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Post
            </button>
          </div>
        </div>
        <div className="text-white p-6 max-w-7xl mx-auto">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-2xl font-semibold">Configuration Details</h1>
          </div>
          <div className="gap-8 justify-center">
            <div className="p-4 bg-zinc-700 rounded">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">First Filler:</label>
                <input
                  type="text"
                  value={firstFiller}
                  onChange={(e) => handleInputChange(e, setFirstFiller)}
                  className="w-full p-2 bg-zinc-800 rounded text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Voice ID:</label>
                <input
                  type="text"
                  value={voiceId}
                  onChange={(e) => handleInputChange(e, setVoiceId)}
                  className="w-full p-2 bg-zinc-800 rounded text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Audio Speed:</label>
                <input
                  type="number"
                  value={audioSpeed}
                  onChange={handleAudioSpeedChange}
                  className="w-full p-2 bg-zinc-800 rounded text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Fillers:</label>
                <ReactTagInput
                  tags={fillers}
                  placeholder="Add fillers"
                  onChange={handleTagChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;
