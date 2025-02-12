import React from "react";
import { IoIosSend } from "react-icons/io";

const ChatbotModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white text-black p-3 rounded-lg shadow-lg max-w-3xl w-full mx-2 md:mx-0 relative">
        <h2 className="text-base text-gray-700 font-semibold">Ask AI</h2>
        <div className="md:px-12 px-3 py-4">
          <button
            className="absolute top-1 right-4 text-black text-3xl"
            onClick={onClose}
          >
            &times;
          </button>
          <div className="text-justify flex flex-col w-full font-semibold">
            <h2 className="mb-1">Hi!</h2>
            <p className="mb-2 leading-8">
              I'm an AI assistant trained on documentation, help articles, and
              other content.
              <br />
              Ask me anything about
              <span className="ml-1 font-bold">
                Talk
                <span className="text-[#5D5FEF]">Better</span>.
              </span>
            </p>
            <div className="mb-4">
              <h3 className="text-lg mb-2 text-gray-500">Example Questions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="border border-gray-700 p-2 rounded-lg transition-all duration-300">
                  What voices are supported?
                </button>
                <button className="border border-gray-700 p-2 rounded-lg">
                  What languages are supported?
                </button>
                <button className="border border-gray-700 p-2 rounded-lg">
                  How do I connect a custom LLM?
                </button>
                <button className="border border-gray-700 p-2 rounded-lg">
                  How do I fetch the prompt dynamically?
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center items-center w-full px-2 rounded-lg  border border-gray-700 ">
            <input
              type="text"
              className="w-full p-2 rounded-lg text-gray-800 focus:outline-none"
              placeholder="How do I get started?"
            />
            <IoIosSend size="26px" className="text-gray-800 cursor-pointer" />
          </div>
          <div className="mt-4 text-right">
            <button className="text-sm text-gray-800">Get help</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;
