import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {BACKEND_BASE_URL} from '../constant/URL'

const AssistantDetails = () => {
  const { id } = useParams();
  const [assistant, setAssistant] = useState(null);
console.log(id)
  useEffect(() => {
    const fetchAssistantDetails = async () => {
      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/configs/findOneAssistantById?id=${id}`,
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );
        setAssistant(response.data);
      } catch (error) {
        console.error("Error fetching assistant details:", error);
      }
    };

    fetchAssistantDetails();
  }, [id]);

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center w-full h-screen z-50">
      <div className="bg-zinc-900 rounded-lg p-8 max-w-4xl w-full mx-4">
        {assistant ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl text-white font-semibold">
                Assistant Details
              </h2>
            </div>
            <div className="text-white mb-4">
                {console.log(assistant.data)}
              <h3 className="text-lg font-semibold">{assistant && assistant.data.name}</h3>
              <p className="text-sm">{assistant &&assistant.data.instructions}</p>
            </div>
            <div className="flex justify-end">
              <Link to={"/assistants"}>
                <button className="text-white px-4 py-2 rounded-lg">
                  Back
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-white">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default AssistantDetails;
