import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { data } from "autoprefixer";
import { Link, useParams } from "react-router-dom";
import Chatbot from "./Chatbot";
import Voicebot from "./Voicebot";
import {BACKEND_BASE_URL} from '../constant/URL'

const Configuration = () => {
  const idx = useParams();

  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [provider, setProvider] = useState("openai");
  const [model, setModel] = useState("GPT 3.5 Turbo Cluster");
  const [knowledgeBase, setKnowledgeBase] = useState("No Documents Added");
  const [temperature, setTemperature] = useState(1);
  const [maxTokens, setMaxTokens] = useState(250);
  const [detectSpeechEmotion, setDetectSpeechEmotion] = useState(false);
  const [transProvider, setTransprovider] = useState("deepgram");
  const [transModel, setTransModel] = useState("Nova 2");
  const [voiceProvider, setVoiceProvider] = useState("11labs");
  const [voice, setVoice] = useState("Sarah (sarah)");
  const [stability, setStability] = useState(0.3);
  const [similarityBoost, setSimilarityBoost] = useState(0.5);
  const [language, setLanguage] = useState("en");
  const [activeContent, setActiveContent] = useState("content1");
  const [cloneData, setCloneData] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [clone, setCloneName] = useState("");

  const [clonefirstMessage, setClonetFirstMessage] = useState("");
  const [cloneId, setCloneId] = useState("");
  const [clonesystemPrompt, setCloneSystemPrompt] = useState("");
  const [cloneprovider, setCloneProvider] = useState("openai");
  const [clonemodel, setCloneModel] = useState("GPT 3.5 Turbo Cluster");
  const [cloneknowledgeBase, setCloneKnowledgeBase] =
    useState("No Documents Added");
  const [clonetemperature, setCloneTemperature] = useState(1);
  const [clonemaxTokens, setCloneMaxTokens] = useState(250);
  const [clonedetectSpeechEmotion, setCloneDetectSpeechEmotion] =
    useState(false);
  const [clonetransProvider, setCloneTransprovider] = useState("deepgram");
  const [clonetransModel, setCloneTransModel] = useState("Nova 2");
  const [clonevoiceProvider, setCloneVoiceProvider] = useState("11labs");
  const [clonevoice, setCloneVoice] = useState("Sarah (sarah)");
  const [clonestability, setCloneStability] = useState(0.3);
  const [clonesimilarityBoost, setCloneSimilarityBoost] = useState(0.5);
  const [clonelanguage, setCloneLanguage] = useState("en");
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false)

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleButtonClick = (contentId) => {
    setActiveContent(contentId);
  };

  const handleSubmit = async () => {
    const data = {
      firstMessage,
      systemPrompt,
      provider,
      model,
      knowledgeBase,
      temperature,
      maxTokens,
      detectSpeechEmotion,
      transProvider,
      transModel,
      voiceProvider,
      voice,
      stability,
      similarityBoost,
      language,
    };

    console.log(cloneData);

    try {
      const response = await fetch(
        "https://api.npoint.io/81798e3c202d98eb3bd0",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          return;
        }

        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/configs/findOneAssistantById?id=${idx.id}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        const data = response.data;
        localStorage.setItem("APIKEY", data.data.apiKey);
        console.log("id", data.data.apiKey);
        setName(data.data.name);
        setId(data.data.assistantId);
        // setFirstMessage(data.firstMessage);
        setSystemPrompt(data.data.instructions);
        // setProvider(data.provider);
        // setModel(data.model);
        // setKnowledgeBase(data.knowledgeBase);
        // setTemperature(data.temperature);
        // setMaxTokens(data.maxTokens);
        // setDetectSpeechEmotion(data.detectSpeechEmotion);
        // setTransprovider(data.transProvider);
        // setTransModel(data.transModel);
        // setVoiceProvider(data.voiceProvider);
        // setVoice(data.voice.voice);
        // setStability(data.voice.stability);
        // setSimilarityBoost(data.voice.similarityBoost);
        // setLanguage(data.language);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="bg-zinc-800  text-white font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-5">
            <div>
              <h1 className="text-2xl font-semibold">
                {cloneData.length > 0 ? clone : name}
              </h1>
              <p className="text-sm mt-1">
                {cloneData.length > 0 ? cloneId : id}
              </p>
              {/* {cloneData.map((e, idx) => {
                  return (
                    <div key={idx}>
                      <h1 className="text-2xl font-semibold">
                        Mary(copy{idx + 1})
                      </h1>
                      <p className="text-sm mt-1">{e.id}</p>
                    </div>
                  );
                })} */}
            </div>

            <div className="flex items-center space-x-4">
              <div>
                {show ? <Chatbot data={data.data.apiKey} /> : ""}
                <button
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  onClick={toggleVisibility}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-9.4-9.4a1.25 1.25 0 011.768-1.768l9.4 9.4m0 0l4.2 4.2m-4.2-4.2L19.824 21.34a1.25 1.25 0 01-1.768 1.768L10.752 15.168m4-4L5.568 1.752A1.25 1.25 0 003.8 3.52l9.4 9.4"
                    />
                  </svg>
                  <span>Ask to {cloneData.length > 0 ? clone : name}</span>
                </button>
              </div>

              {isVisible && (
                <div className="fixed  inset-0 flex items-center justify-center  bg-black bg-opacity-50">
                  <div className=" p-8 h-1/2 bg-[#0E0E18] rounded shadow-lg relative">
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                      onClick={toggleVisibility}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                   <Voicebot/>
                  </div>
                </div>
              )}
              <div to={"/chatbots"}>
                {show ? <Chatbot data={data.data.apiKey} /> : ""}
                <button onClick={toggleChat} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                  
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.752 11.168l-9.4-9.4a1.25 1.25 0 011.768-1.768l9.4 9.4m0 0l4.2 4.2m-4.2-4.2L19.824 21.34a1.25 1.25 0 01-1.768 1.768L10.752 15.168m4-4L5.568 1.752A1.25 1.25 0 003.8 3.52l9.4 9.4"
                    />
                  </svg>
                  <span>Chat with {cloneData.length > 0 ? clone : name}</span>
                </button>
              </div>
              
{isChatVisible && (
<div className="fixed  inset-0 flex items-center justify-center  bg-black bg-opacity-50">
  <div className=" p-8 h-40 bg-[#0E0E18] rounded shadow-lg relative">
    <button
      className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
      onClick={toggleChat}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
   <Chatbot/>
  </div>
</div>
)}
              <button
                className="bg-zinc-600 hover:bg-zinc-700 p-2 rounded-full"
                // onClick={cloneProect}
              >
                Clone
              </button>
            </div>
          </div>
          <div className=" p-4 pb-6">
            <div className="flex items-center space-x-4">
              <span className="text-white">🟢 Vapi Fixed Cost</span>
              <span className="text-red-500">🔴 deepgram</span>
              <span className="text-blue-500">
                🔵 Vapi GPT-3.5 Turbo Cluster
              </span>
              <span className="text-yellow-500">🟡 11labs Turbo V2</span>
              <span className="text-purple-500">🟣 web</span>
              <div className=" bg-zinc-800 text-white py-1 px-3  pl-80 rounded-lg cursor-pointer">
                Mode{" "}
                <select className="bg-zinc-800 text-white  outline-none ml-1">
                  <option>Web</option>
                </select>
              </div>
            </div>
=
         
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Cost</h2>
                <span>~$0.1 / min</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-zinc-600 rounded-full h-2.5">
                  <div
                    className="bg-green-400 h-2.5 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Latency</h2>
                <span>~950 ms</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-zinc-600 rounded-full h-2.5">
                  <div
                    className="bg-purple-400 h-2.5 rounded-full"
                    style={{ width: "70%" }}
                  ></div>
                </div>
              </div>
            </div>

          </div> 
        </div>
        <div className="text-white p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => handleButtonClick("content1")}
              className="text-xl font-semibold"
            >
              Model
            </button>
            <button
              onClick={() => handleButtonClick("content2")}
              className="text-xl font-semibold"
            >
              Transcriber
            </button>
            <button
              onClick={() => handleButtonClick("content3")}
              className="text-xl font-semibold"
            >
              Voice
            </button>
            <Link to="/configured">
              <button
                onClick={handleSubmit}
                className="bg-violet-500 text-white px-4 py-2 rounded"
              >
                Configure
              </button>
            </Link>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Published
            </button>
          </div>
        </div>
        {activeContent === "content1" && (
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 p-4 bg-zinc-700 rounded">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  First Message
                </label>
                <input
                  className="p-3 w-full bg-zinc-800 rounded"
                  value={
                    cloneData.length > 0 ? clonefirstMessage : firstMessage
                  }
                  onChange={(e) => setFirstMessage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  System Prompt
                </label>

                <textarea
                  className="p-3 h-96 w-full bg-zinc-800 rounded resize-none text-white"
                  value={
                    cloneData.length > 0 ? clonesystemPrompt : systemPrompt
                  }
                  onChange={(e) => setSystemPrompt(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 bg-zinc-700 rounded">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Provider
                </label>
                <select
                  className="w-full p-2 bg-zinc-800 rounded text-white"
                  value={cloneData.length > 0 ? cloneprovider : provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  <option>openai</option>
                  <option>together-ai</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Model</label>
                <select
                  className="w-full p-2 bg-zinc-800 rounded text-white"
                  value={cloneData.length > 0 ? clonemodel : model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option>GPT 3.5 Turbo Cluster</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Knowledge Base
                </label>
                <select
                  className="w-full p-2 bg-zinc-800 rounded text-white"
                  value={
                    cloneData.length > 0 ? cloneknowledgeBase : knowledgeBase
                  }
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                >
                  <option>No Documents Added</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Temperature
                </label>

                <input
                  type="range"
                  min="0"
                  max="10"
                  value={cloneData.length > 0 ? clonetemperature : temperature}
                  className="w-full h-2 bg-zinc-600 rounded"
                  onChange={(e) => setTemperature(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={cloneData.length > 0 ? clonemaxTokens : maxTokens}
                  className="w-full p-2 bg-zinc-800 rounded text-white"
                  onChange={(e) => setMaxTokens(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Detect Speech Emotion
                </label>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-green-500 bg-zinc-800 rounded border-zinc-600"
                  checked={
                    cloneData.length > 0
                      ? clonedetectSpeechEmotion
                      : detectSpeechEmotion
                  }
                  onChange={(e) => setDetectSpeechEmotion(e.target.checked)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {activeContent === "content2" && (
        <div className="p-6 bg-zinc-800 ">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="provider" className="block mb-2 text-zinc-400">
                Provider
              </label>
              <select
                id="provider"
                value={
                  cloneData.length > 0 ? clonetransProvider : transProvider
                }
                onChange={(e) => setTransprovider(e.target.value)}
                className="w-full p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
              >
                <option>deepgram</option>
                <option>talkscriber</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block mb-2 text-zinc-400">
                Language
              </label>
              <select
                id="language"
                value={cloneData.length > 0 ? clonelanguage : language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
              >
                <option>en</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="model" className="block mb-2 text-zinc-400">
              Model
            </label>
            <select
              id="model"
              value={cloneData.length > 0 ? clonetransModel : transModel}
              onChange={(e) => setTransModel(e.target.value)}
              className="w-full mb-72 p-2 bg-zinc-700 text-white border border-zinc-600 rounded"
            >
              <option>Nova 2</option>
              <option>Nova 2 General</option>
            </select>
          </div>
        </div>
      )}
      {activeContent === "content3" && (
        <div className="">
          <div className="bg-zinc-800  text-zinc-100 p-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label
                  htmlFor="provider"
                  className="block text-sm font-medium mb-1"
                >
                  Provider
                </label>
                <select
                  value={
                    cloneData.length > 0 ? clonevoiceProvider : voiceProvider
                  }
                  onChange={(e) => setVoiceProvider(e.target.value)}
                  id="provider"
                  className="block w-full bg-zinc-700 text-white border border-zinc-600 rounded-md p-2"
                >
                  <option>11labs</option>
                </select>
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="voice"
                  className="block text-sm font-medium mb-1"
                >
                  Voice
                </label>
                <select
                  value={cloneData.length > 0 ? clonevoice : voice}
                  onChange={(e) => setVoice(e.target.value)}
                  id="voice"
                  className="block w-full bg-zinc-700 text-white border border-zinc-600 rounded-md p-2"
                >
                  <option>Sarah (sarah)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200">
            <div className="mb-4">
              <label htmlFor="stability" className="block text-sm font-medium">
                Stability
              </label>
              <div className="flex items-center">
                <span className="text-sm w-12 text-right">{stability}</span>
                <input
                  type="range"
                  id="stability"
                  name="stability"
                  min="0"
                  max="1"
                  step="0.1"
                  value={cloneData.length > 0 ? clonestability : stability}
                  onChange={(e) => setStability(e.target.value)}
                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="cursor-help" title="More Vundefinedble">
                  More Vundefinedble
                </span>
                <span className="cursor-help" title="More Stable">
                  More Stable
                </span>
              </div>
            </div>
            <div>
              <label
                htmlFor="claritySimilarity"
                className="block text-sm font-medium"
              >
                Clarity + Similarity
              </label>
              <div className="flex items-center">
                <span className="text-sm w-12 text-right">
                  {similarityBoost}
                </span>
                <input
                  type="range"
                  id="claritySimilarity"
                  name="claritySimilarity"
                  min="0"
                  max="1"
                  step="0.1"
                  onChange={(e) => setSimilarityBoost(e.target.value)}
                  value={
                    cloneData.length ? clonesimilarityBoost : similarityBoost
                  }
                  className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-700"
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="cursor-help" title="Low">
                  Low
                </span>
                <span className="cursor-help mb-72" title="High">
                  High
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Configuration;
