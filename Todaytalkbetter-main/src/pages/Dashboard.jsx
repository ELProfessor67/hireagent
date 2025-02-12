import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Configuration from "./Configuration";

const Dashboard = ({showAssis}) => {
  console.log(showAssis)
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const toggleOverview = () => {
    setIsOverviewOpen(!isOverviewOpen);
  };
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-900 text-white">
      <div className="w-full lg:w-64 bg-zinc-800 p-5 flex-shrink-0">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-green-400 mb-4">VAPI</h1>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={toggleOverview}
          >
            <h2 className="text-xl">Overview</h2>
            <span>{isOverviewOpen ? "▲" : "▼"}</span>
          </div>
          {isOverviewOpen && (
            <ul className="mt-4">
              <li className="mb-2">
                <a href="#" className="flex items-center">
                  <span className="mr-2">📁</span> Assistants
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center">
                  <span className="mr-2">📞</span> Phone Numbers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="flex items-center">
                  <span className="mr-2">📄</span> Documents
                </a>
              </li>
            </ul>
          )}
        </div>
        <ul>
          <li className="mb-2">
            <a href="#" className="flex items-center">
              <span className="mr-2">🔊</span> Voice Library
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center">
              <span className="mr-2">📞</span> Call Logs
            </a>
          </li>
          <li className="mb-2">
            <a href="#" className="flex items-center">
              <span className="mr-2">🔗</span> Provider APIs
            </a>
          </li>
        </ul>
        <div className="mt-10 p-5">
          <div className="flex items-center">
            <span className="mr-2">👤</span> Profile
          </div>
          <div className="mt-2">
            <span>namdevilesh63@...</span>
          </div>
        </div>
      </div>
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <button
            className="bg-zinc-700 text-white p-2 rounded-lg w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4"
            onClick={() => {
              
              navigate("/assistants")
            }}
          >
            Create Assistant
          </button>
          <div className="bg-zinc-700 p-2 rounded-lg flex items-center justify-between">
            <span></span>
          </div>
        </div>

        {!showAssis ? (
          <div className="flex justify-center items-center flex-col text-center h-full">
            <h3 className="text-3xl font-bold mb-2">No Assistants Found</h3>
            <p>
              Create a new assistant to get started with your first
              conversation.
            </p>
          </div>
        ) : (
          <Configuration />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
