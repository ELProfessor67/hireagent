import React, { useState, useEffect } from "react";
import axios from "axios";
import {BACKEND_BASE_URL} from '../constant/URL'

const Configuration1 = ({ onClose, initialConfig }) => {
  const [config, setConfig] = useState(initialConfig || {});

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      console;
      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/configs/createAndEditConfig`,
        { ...config, id: config._id }, // Include the ID in the request body
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Configuration updated successfully:", response.data);
      onClose(); // Close the popup after saving
    } catch (error) {
      console.error("Error updating configuration:", error);
    }
  };

  return (
    <div
      role="dialog"
      className="fixed left-[50%] top-[50%] z-50 bg-black flex flex-col text-white w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[600px] p-10 space-y-0 max-h-screen overflow-auto"
      tabIndex="-1"
      style={{ pointerEvents: "auto" }}
    >
      <div className="flex flex-col gap-2 mb-2">
        <p>Edit Configuration</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="voiceId">Voice ID</label>
        <input
          type="text"
          id="voiceId"
          name="voiceId"
          value={config.voiceId || ""}
          onChange={handleInputChange}
          className="p-2 w-full border outline-none rounded-md text-black"
        />
        <label htmlFor="firstFiller">First Filler</label>
        <input
          type="text"
          id="firstFiller"
          name="firstFiller"
          value={config.firstFiller || ""}
          onChange={handleInputChange}
          className="p-2 w-full border outline-none rounded-md text-black"
        />
        <label htmlFor="audioSpeed">Audio Speed</label>
        <input
          type="number"
          step="0.1"
          id="audioSpeed"
          name="audioSpeed"
          value={config.audioSpeed.$numberDecimal || ""}
          onChange={handleInputChange}
          className="p-2 w-full border outline-none rounded-md text-black"
        />
        <label htmlFor="fillers">Fillers</label>
        <input
          type="text"
          id="fillers"
          name="fillers"
          value={config.fillers.join(", ") || ""}
          onChange={(e) =>
            setConfig({ ...config, fillers: e.target.value.split(", ") })
          }
          className="p-2 w-full border outline-none rounded-md text-black"
        />
      </div>
      <div className="flex justify-between mt-4">
        <button className="text-white bg-red-500 px-3 py-2" onClick={onClose}>
          Cancel
        </button>
        <button
          className="text-white bg-green-500 px-3 py-2"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Configuration1;
