import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BlankTemplatePopup1 from "./Blankpopup1";
import {BACKEND_BASE_URL} from '../constant/URL'

const AssistantsList = () => {
  const [assistants, setAssistants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssistantId, setSelectedAssistantId] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssistants = async () => {
      const token = localStorage.getItem("Token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/configs/findAllAssistants`,
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );
        setAssistants(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assistants", error);
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  const handleEditButtonClick = (id) => {
    setSelectedAssistantId(id);
    setShowEditPopup(true);
  };

  const handleCloseEditPopup = () => {
    setShowEditPopup(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-800 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Assistants</h1>
      h
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {assistants.map((assistant) => (
          <div
            key={assistant._id}
            className={`bg-gray-700 rounded-lg p-6 shadow-md relative cursor-pointer hover:shadow-xl transition-shadow duration-300 h-96`}
          >
            <div className="overflow-y-auto h-full">
              <h2
                className="text-2xl font-semibold mb-4"
                onClick={() => navigate(`/configure/${assistant._id}`)}
              >
                {assistant.name}
              </h2>
              <p className="mb-4">{assistant.instructions}</p>
              <div className="text-sm">
                <p className="mb-2">
                  <strong>Assistant ID:</strong> {assistant.assistantId}
                </p>
                <p className="mb-2">
                  <strong>Twilio Number:</strong> {assistant.twilioNumber}
                </p>
                <p className="mb-2">
                  <strong>Created At:</strong>{" "}
                  {new Date(assistant.createdAt).toLocaleString()}
                </p>
                <p className="mb-2">
                  <strong>Updated At:</strong>{" "}
                  {new Date(assistant.updatedAt).toLocaleString()}
                </p>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded transition-colors duration-300 absolute bottom-6 right-6"
                  onClick={() => handleEditButtonClick(assistant._id)}
                >
                  Edit Assistant
                </button>
              </div>
             
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end absolute right-10 top-10  mt-8">
        <Link to="/">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition-colors duration-300">
            Back
          </button>
        </Link>
      </div>

      {showEditPopup && (
        <BlankTemplatePopup1
          assistant={assistants.find(
            (assistant) => assistant._id === selectedAssistantId
          )}
          onClose={handleCloseEditPopup}
        />
      )}
    </div>
  );
};

export default AssistantsList;
