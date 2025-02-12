import React, { useState } from "react";
import { BACKEND_BASE_URL } from "../constant/URL";
import axios from "axios";

function FunctionConfiguration({ assistantId,functions }) {
  const [functionName, setFunctionName] = useState("");
  const [description, setDescription] = useState("");
  const [parameters, setParameters] = useState([{ name: "", type: "", description: "" }]);
  const [webhookURL, setWebhookURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddParameter = () => {
    setParameters([...parameters, { name: "", type: "" }]);
  };

  const handleParameterChange = (index, field, value) => {
    const updatedParameters = [...parameters];
    updatedParameters[index][field] = value;
    setParameters(updatedParameters);
  };

  const handleRemoveParameter = (index) => {
    const updatedParameters = parameters.filter((_, i) => i !== index);
    setParameters(updatedParameters);
  };

  const handleSubmit = async () => {
    const config = {
      functionName,
      description,
      parameters,
      webhookURL,
    };
    // assistantId,modelToolName, description, perameter
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/configs/create-function`,
        {
          assistantId,
          modelToolName: functionName,
          description: description,
          perameter: parameters,
          webhook: webhookURL
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("Configuration updated successfully:", response.data);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.error("Error creating/updating assistant:", error);
    }finally{
      setLoading(false)
    }
    console.log("Submitted Configuration:", config);
  };

  return (
    <div className="p-6 rounded-xl md:w-auto w-[35rem] md:ml-40 md:-mt-[15.3rem]  bg-[#25263F]">
      <h1>Total function : {functions.length}
      </h1>
      {/* {
        functions && functions.map(f => (
          <div className="flex items-center justify-center">
            <p>{f.modelToolName}</p>
          </div>
        ))
      } */}
      <h2 className="text-2xl font-semibold text-white mb-4">
        Function Configuration
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          Function Name
        </label>
        <input
          type="text"
          value={functionName}
          onChange={(e) => setFunctionName(e.target.value)}
          className="w-full p-2 bg-[#1F1B29] rounded text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-[#1F1B29] rounded text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          Parameters
        </label>
        {parameters.map((param, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <input
              type="text"
              placeholder="Parameter Name"
              value={param.name}
              onChange={(e) =>
                handleParameterChange(index, "name", e.target.value)
              }
              className="w-1/2 p-2 bg-[#1F1B29] rounded text-white"
            />

            <input
              type="text"
              placeholder="Description"
              value={param.description}
              onChange={(e) =>
                handleParameterChange(index, "description", e.target.value)
              }
              className="w-1/2 p-2 bg-[#1F1B29] rounded text-white"
            />

            <select
              value={param.type}
              onChange={(e) =>
                handleParameterChange(index, "type", e.target.value)
              }
              className="w-1/2 p-2 bg-[#1F1B29] rounded text-white"
            >
              <option value="">Select Type</option>
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>

            <button
              onClick={() => handleRemoveParameter(index)}
              className="text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddParameter}
          className="text-sm text-blue-400 hover:text-blue-600 mt-2"
        >
          + Add Parameter
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-2">
          Webhook URL
        </label>
        <input
          type="url"
          value={webhookURL}
          onChange={(e) => setWebhookURL(e.target.value)}
          className="w-full p-2 bg-[#1F1B29] rounded text-white"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 p-2 rounded text-white hover:bg-blue-700"
      >
       {loading ? "Loading...": "Submit Configuration"}
      </button>
    </div>
  );
}

export default FunctionConfiguration;
