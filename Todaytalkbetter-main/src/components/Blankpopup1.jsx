import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {BACKEND_BASE_URL} from '../constant/URL'

const BlankTemplatePopup1 = ({ assistant, onClose }) => {
  console.log(assistant);
  const [name, setName] = useState(assistant ? assistant.name : "");
  const [instruction, setInstruction] = useState(assistant ? assistant.instructions : "");
  const [configs, setConfigs] = useState([]);
  const [selectedConfig, setSelectedConfig] = useState(assistant ? assistant.configId : null); // Assuming assistant.configId is where configId is stored
  const [twilioNumber, setTwilioNumber] = useState(assistant ? assistant.twilioNumber : "");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/configs/getConfigs`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setConfigs(response.data.data);
      } catch (error) {
        console.error("Error fetching configs:", error);
      }
    };

    fetchConfigs();
  }, []);

  const handleCreateOrUpdateAssistant = async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const apiEndpoint = `${BACKEND_BASE_URL}/api/configs/createAssistant`;

      const requestBody = {
        name: name,
        instructions: instruction,
        configId: selectedConfig,
        twilioNumber: twilioNumber,
      };

      if (assistant) {
        requestBody.id = assistant._id;
      }

      const response = await axios.post(
        apiEndpoint,
        requestBody,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Assistant created/updated successfully:", response.data);

      navigate("/assistantlist");
    } catch (error) {
      console.error("Error creating/updating assistant:", error);
    }
  };

  const handleReadMore = (config) => {
    setSelectedConfig(config._id); // Assuming config._id is the identifier for the config
  };

  return (
    <div
      role="dialog"
      className="fixed left-[50%] top-[50%] z-50 bg-black flex flex-col text-white w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[600px] p-10 space-y-0 max-h-screen overflow-auto"
      tabIndex="-1"
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex flex-col gap-2 mb-2">
        <p>{assistant ? "Edit Assistant" : "Create New Assistant"}</p>
        <p>{assistant ? "Update the details for the assistant." : "Let's customize your Voicebot!"}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Voicebot Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 w-full border outline-none rounded-md placeholder:text-black text-black"
            placeholder="Enter the Name"
          />
          <label htmlFor="instruction">Voicebot Instructions</label>
          <textarea
            id="instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="p-2 w-full border outline-none rounded-md placeholder:text-black text-black"
            placeholder="Enter the Instructions"
            rows="5"
          />
          <label htmlFor="twilioNumber">Twilio Number</label>
          <input
            type="text"
            id="twilioNumber"
            value={twilioNumber}
            onChange={(e) => setTwilioNumber(e.target.value)}
            className="p-2 w-full border outline-none rounded-md placeholder:text-black text-black"
            placeholder="Enter the Twilio Number"
          />
          <label htmlFor="config">Select Configuration</label>
          <div className="flex flex-col gap-2">
            <select
              id="config"
              onChange={(e) => setSelectedConfig(e.target.value)}
              className="p-2 w-full border outline-none rounded-md text-black"
              value={selectedConfig || ""}
            >
              <option value="">Select a Configuration</option>
              {configs.map((config) => (
                <option key={config._id} value={config._id}>
                  {config._id}
                </option>
              ))}
            </select>
            <button
              className="mt-2 px-5 py-2 bg-blue-400 rounded-md text-white"
              onClick={() => handleReadMore(selectedConfig)}
              disabled={!selectedConfig}
            >
              Read More
            </button>
          </div>
          <p className="text-sm">
            This is a basic AI assistant template with minimal configurations.
            It's designed to serve as a starting point for creating your custom voicebot.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="text-white" onClick={onClose}>
          Back
        </button>
        <button
          className="px-5 py-2 bg-green-400 rounded-md text-white"
          onClick={handleCreateOrUpdateAssistant}
        >
          {assistant ? "Update Assistant" : "Create New Assistant"}
        </button>
      </div>
    </div>
  );
};

export default BlankTemplatePopup1;
