import { useEffect, useRef, useState } from "react";
import React from "react";
import "./Config.css";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import Chatbot from "./Chatbot";
import { FaPhone, FaRegCopy } from "react-icons/fa";
import Select from "react-select";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { voiceData } from "../assets/data/playhtdata";
import { BACKEND_BASE_URL, TWILLO_SERVER_URL } from '../constant/URL'
import FunctionConfiguration from "../components/FunctionConfigration";
import TwilloConfiguration from "../components/TwilloConfigration";
import CallDialoag from "../components/CallDialoag";

const ConfigurationDummy = ({ open, isdummyfunc }) => {
  const [apikey, setApiKey] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [endCall, setEndCall] = useState(true);
  const [selectedModel, setSelectedModel] = useState("");



  const recognitionRef = useRef(null);
  const socket = useRef(null);
  const audioContextRef = useRef(null);
  const audioBufferQueue = useRef([]);
  const isPlayingRef = useRef(false);
  const sourceNodeRef = useRef(null);

  const [placeholders, setPlaceholders] = useState([{ key: "", value: "" }]);


  const addPlaceholder = () => {
    setPlaceholders([...placeholders, { key: "", value: "" }]);
  };


  const updatePlaceholder = (index, field, value) => {
    const updatedPlaceholders = [...placeholders];
    updatedPlaceholders[index][field] = value;
    setPlaceholders(updatedPlaceholders);
  };


  const removePlaceholder = (index) => {
    setPlaceholders(placeholders.filter((_, i) => i !== index));
  };


  useEffect(() => {
    socket.current = io("https://voicebots.trainright.fit", {
      query: { apiKey: apikey, isVoiceNeeded: true },
    });

    socket.current.on("connect", () => {
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.current.on("audio-chunk", async (chunk) => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        const audioData = new Uint8Array(chunk).buffer;

        audioContextRef.current
          .decodeAudioData(audioData)
          .then((audioBuffer) => {
            audioBufferQueue.current.push(audioBuffer);
            if (!isPlayingRef.current) {
              playAudioQueue();
            }
          })
          .catch((error) => {
            console.error("Error decoding audio data:", error);
          });
      } catch (error) {
        console.error("Error processing audio chunk:", error);
      }
    });

    return () => {
      socket.current.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [apikey]);

  const playAudioQueue = async () => {
    if (audioBufferQueue.current.length > 0) {
      isPlayingRef.current = true;
      const audioBuffer = audioBufferQueue.current.shift();
      const sourceNode = audioContextRef.current.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContextRef.current.destination);
      sourceNode.onended = () => {
        if (audioBufferQueue.current.length > 0) {
          playAudioQueue();
        } else {
          isPlayingRef.current = false;
        }
      };
      sourceNode.start();
      sourceNodeRef.current = sourceNode;
    } else {
      isPlayingRef.current = false;
    }
  };

  const stopPlaybackAndClearQueue = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    audioBufferQueue.current = [];
    isPlayingRef.current = false;
    setIsLoading(false);
  };

  const handleSpeech = () => {
    if (!isCalling) {
      setIsCalling(true);
      setEndCall(true);
    } else {
      setIsCalling(false);
      setEndCall(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopPlaybackAndClearQueue();
      return;
    }

    if (!("webkitSpeechRecognition" in window)) {
      alert(
        "Your browser does not support speech recognition. Please use Chrome."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      stopPlaybackAndClearQueue();
      return;
    }

    if (isPlayingRef.current) {
      stopPlaybackAndClearQueue();
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Speech recognition started");
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      alert(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      if (isCalling) {
        recognition.start(); // Restart recognition if the call is still active
      } else {
        setIsListening(false);
        setIsLoading(true);
      }
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      setText(finalTranscript);
      console.log("Speech recognition result:", finalTranscript);
      if (finalTranscript) {
        socket.current.emit("message", finalTranscript);
      }
    };

    recognition.start();
    setIsListening(true);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (sourceNodeRef.current) {
      if (!isMuted) {
        sourceNodeRef.current.disconnect(audioContextRef.current.destination);
      } else {
        sourceNodeRef.current.connect(audioContextRef.current.destination);
      }
    }
  };
  console.log(open);
  const navigate = useNavigate();
  const idx = useParams();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [configs, setConfigs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [configid, setConfigId] = useState("");
  const [activeContent, setActiveContent] = useState("content1");
  const [firstFillers, setFirstFillers] = useState("");
  const [fillers, setFillers] = useState([]);
  const [voiceID, setVoiceID] = useState("");
  const [audioSpeed, setAudioSpeed] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dataPrompt, setDataPrompt] = useState("");
  const [functions, setFunctions] = useState([]);
  const [twilioNumber, setTwilioNumber] = useState("");
  const [assistantType, setAssistantType] = useState("service");
  const [isPublish, setIsPublish] = useState(false);
  const [openCall, setOpenCall] = useState(false);
  const [assistant, setAssistant] = useState(null);

  const chatRef = useRef();
  const handleButtonClick = (contentId) => {
    setActiveContent(contentId);
  };
  const handleChange = (event) => {
    setSelectedModel(event.target.value);
  };
  const handleOutsideClick = (e) => {
    if (chatRef.current && !chatRef.current.contains(e.target)) {
      setIsChatVisible(false);
    }
  };

  useEffect(() => {
    if (isChatVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isChatVisible]);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const options = voiceData.map((voice) => ({
    value: voice.id,
    label: voice.name,
  }));
  const handleTagChange = (newTags) => {
    setFillers(newTags);
  };
  const [loading, setLoading] = useState(false);

  const handlePublish = async (value) => {
    setIsPublish(value);
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const apiEndpoint =
        `${BACKEND_BASE_URL}/api/configs/update-status`;
      const requestBody = {
        value: value,
        id: idx.id,
      };

      // First API call
      const response = await axios.post(apiEndpoint, requestBody, {
        headers: {
          Authorization: token,
        },
      });
      console.log("Assistant updated successfully:", response.data);
    } catch (error) {
      console.error("Error creating/updating assistant:", error.message);
    }
  }

  const handlePost = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("Token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const apiEndpoint =
        `${BACKEND_BASE_URL}/api/configs/createAssistant`;
      const requestBody = {
        name: name,
        instructions: systemPrompt,
        configId: configid,
        twilioNumber: twilioNumber || undefined,
        id: idx.id,
        firstFiller: firstFillers,
        placeholders
      };

      // First API call
      const response = await axios.post(apiEndpoint, requestBody, {
        headers: {
          Authorization: token,
        },
      });
      console.log("Assistant updated successfully:", response.data);

      // Second API call
      console.log({ fillers, firstFillers, audioSpeed, voiceID, configid });
      const response1 = await axios.post(
        `${BACKEND_BASE_URL}/api/configs/createAndEditConfig`,
        {
          fillers: fillers,
          firstFiller: firstFillers,
          audioSpeed: audioSpeed,
          voiceId: voiceID,
          id: configid,
          aiModel: selectedModel,
          informationNeeded: dataPrompt,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("Configuration updated successfully:", response1.data);
      setLoading(false);
      // Update local state after successful updates
      // setFirstFillers(response1.data.firstFiller);
      setFillers(response1.data.fillers);
      setVoiceID(response1.data.voiceId);
      setAudioSpeed(response1.data.audioSpeed);
      setDataPrompt(response1.data.informationNeeded);
      setSelectedModel(response1.data.aiModel);
      alert("Updated");
      window.location.reload();
    } catch (error) {
      console.error("Error creating/updating assistant:", error);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  function getconfigdata(data) {
    console.log([data]);
    let a = [data][0].filter((e) => e._id === configid);
    if (a.length > 0) {
      // console.log(a[0])
      // setFirstFillers(a[0].firstFiller);
      setFillers(a[0].fillers);
      setDataPrompt(a[0].informationNeeded);
      // setConfigIdd(a[0]._id)

      setSelectedModel(a[0].aiModel);
      setVoiceID(a[0].voiceId);
      setAudioSpeed(a[0].audioSpeed.$numberDecimal);
      // setApiKey(a[0].audioSpeed.$numberDecimal);
      console.log("Config data:", a[0]);
    } else {
      console.error("Config not found for configId:", configid);
    }
  }

 
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
        setAssistant(data.data);
        setApiKey(data.data.apiKey);
        console.log("configID", data.data.configId);
        localStorage.setItem("APIKEY", data.data.apiKey);
        setName(data.data.name);
        setId(data.data.assistantId);
        setConfigId(data.data.configId);
        setSystemPrompt(data.data.instructions);
        setTwilioNumber(data.data.twilioNumber);
        setFirstFillers(data.data.firstFiller);
        setPlaceholders(data.data.placeholders);
        setAssistantType(data.data.type);
        setIsPublish(data.data.isPublish);

        setFunctions(data.data.function)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


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
        console.log("Fetch configs response:", response.data);
        setConfigs(response.data.data);
        getconfigdata(response.data.data); // Ensure this function sets firstFillers correctly
      } catch (error) {
        console.error("Error fetching configs:", error);
      }
    };

    fetchConfigs();
  }, [configid]); // Dependency on configid to refetch configs when it changes
  // Example of including a token dependency
  useEffect(() => {
    isdummyfunc(location.pathname.slice(0, 20));
  }, []);
  return (
    <>
      <div
        className={`${open
          ? "lg:w-[65%] lg:left-[30%]    left-[10rem] w-[68%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
          : "lg:w-[93%] lg:left-[8%]  w-[70%] left-[25%]"
          } fixed  lg:top-[4.6rem] xl:top-[5rem]  h-[85]  rounded-3xl text-white   w-64 top-[6.9rem] sm:top-[4.9rem] `}
      >
        <div
          className={`p-4 md:-ml-7  rounded-xl  left-24  bg-black ${activeContent === "content3" ? "h-[120vh]" : "h-[100vh]"
            } text-white xl:h-[]  overflow-y-scroll   scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-500 h-[90vh] absolute w-[] -right-4 md:right-0 left-3  top-0`}
        >
          <div className="flex  flex- ml-4 justify-between items-center mb-4">
            <h1 className="text-2xl">{name}</h1>
            <div className="flex flex- items-center space-x-2">
              {/* <div className="bg-[#25263F] text-sm px-5 py-3 rounded-full flex  items-center space-x-1">
                <span>{id}</span>
                <FaRegCopy
                  onClick={handleCopy}
                  className={`cursor-pointer ${isCopied ? "text-green-500" : "text-white"
                    }`}
                />
              </div> */}
              <div className="flex flex- items-center space-x-4">
                <div>
                  {show ? <Chatbot data={apikey} /> : ""}
                  <div>
                    <div>
                      {isCalling && endCall ? (
                        <>
                          <button
                            onClick={handleSpeech}
                            className="top-0 bg-red-800 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            End Call
                          </button>
                          <button
                            onClick={handleMute}
                            className="top-0 bg-gray-800 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                          >
                            {isMuted ? "Unmute" : "Mute"}
                          </button>
                        </>
                      ) : (
                        <button
                           onClick={() => setOpenCall(true)}
                          className="bg-[#5D5FEF] text-white font-bold py-2 px-4 rounded inline-flex items-center"
                        >
                          Talk with {name}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div to={"/chatbots"}>
                  {show ? <Chatbot data={apikey} /> : ""}
                  <button
                    onClick={toggleChat}
                    className="bg-[#5D5FEF] text-white font-bold py-2 px-4 rounded inline-flex items-center"
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
                    <span>Chat with {name}</span>
                  </button>
                </div>

                {isChatVisible && (
                  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-15 z-40 left-0 backdrop-blur-md">
                    <div className="p-8 rounded shadow-lg w-3/4 md:w-1/2 lg:w-1/2 h-96 relative">
                      <button
                        className="absolute -top-[2.5rem] right-20 hover:text-gray-300 z-50"
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
                      <Chatbot data={apikey} />
                    </div>
                  </div>
                )}

                {/* <button
              className="bg-zinc-600 hover:bg-zinc-700 p-2 rounded-full"
              // onClick={cloneProect}
            >
              Clone
            </button> */}
              </div>
            </div>
          </div>
          <div className="flex flex- ml-4 justify-between mb-4">
            <div className="bg-[#25263F] py-8 p-4 rounded-lg flex flex-col flex-1 mr-2">
              <div className="flex  justify-between items-center mb-2">
                <span className="flex  items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-zinc-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 3a7 7 0 00-6.938 6H10v4h4v6a7 7 0 100-14z" />
                  </svg>
                  Cost
                </span>
                <span>~$0.1/min</span>
              </div>
              <div className="relative  h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div className="relative h-full">
                  <div
                    className="absolute h-full bg-green-500"
                    style={{ width: "25%" }}
                  ></div>
                  <div
                    className="absolute rounded-full h-full bg-red-500"
                    style={{ width: "15%", left: "25%" }}
                  ></div>
                  <div
                    className="absolute rounded-full h-full bg-purple-500"
                    style={{ width: "20%", left: "40%" }}
                  ></div>
                  <div
                    className="absolute  rounded-full h-full bg-yellow-500"
                    style={{ width: "30%", left: "60%" }}
                  ></div>
                  <div
                    className="absolute h-full bg-blue-500"
                    style={{ width: "10%", left: "90%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-[#25263F] p-4 py-8 rounded-lg flex flex-col flex-1 ml-2">
              <div className="flex justify-between items-center mb-2">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-zinc-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M16 8a4 4 0 00-5.657-3.657L6 7v6l4.343 2.657A4 4 0 0016 12V8z" />
                  </svg>
                  Latency
                </span>
                <span>~$0.1/min</span>
              </div>
              <div className="relative h-2 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full rounded-full bg-green-500"
                  style={{ width: "25%" }}
                ></div>
                <div
                  className="absolute rounded-full h-full bg-red-500"
                  style={{ width: "15%", left: "25%" }}
                ></div>
                <div
                  className="absolute rounded-full h-full bg-purple-500"
                  style={{ width: "20%", left: "40%" }}
                ></div>
                <div
                  className="absolute rounded-full h-full bg-yellow-500"
                  style={{ width: "30%", left: "60%" }}
                ></div>
                <div
                  className="absolute h-full bg-blue-500"
                  style={{ width: "10%", left: "90%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="flex flex- justify-between ml-4 items-center text-sm">
            <div className="flex  flex- space-x-4">
              <div className="flex  items-center space-x-2">
                <span className="w-3 h-3  rounded-full bg-green-500"></span>
                <span className="text-green-500">Fixed Cost</span>
              </div>
              <div className="flex  items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-red-500">deepgram</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                <span className="text-purple-500">TalkBetter GPT</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="text-yellow-500">11labs Turbo V2</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-blue-500">web</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <span className="text-zinc-400">
                Draft Saved about 4 hours ago
              </span> */}
              <button
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onClick={handlePost}
              >
                Save
              </button>
              

              {
                assistantType != "purchased" &&
                <button
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                  onClick={() => handlePublish(!isPublish)}
                >
                  {!isPublish ? "Publish" : "Unpublish"}
                </button>
              }

              {/* <select className="bg-zinc-800 px-4 py-2 rounded-lg flex items-center">
                <option value="Web">Web</option>
              </select> */}
            </div>
          </div>
          <div className="flex  md:flex-col w-40 space-y-2 p-4 bg-z text-white">
            <button
              onClick={() => handleButtonClick("content1")}
              className={`flex  items-center border-2 border-blue-800 py-2 p-3  rounded-md text-white  ${activeContent === "content1" ? "bg-[#5D5FEF]" : "bg-[#131330]"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                viewBox="0 0 256 256"
              >
                <path d="M192.5,171.47A88.34,88.34,0,0,0,224,101.93c-1-45.71-37.61-83.4-83.24-85.8A88,88,0,0,0,48,102L25.55,145.18c-.09.18-.18.36-.26.54a16,16,0,0,0,7.55,20.62l.25.11L56,176.94V208a16,16,0,0,0,16,16h48a8,8,0,0,0,0-16H72V171.81a8,8,0,0,0-4.67-7.28L40,152l23.07-44.34A7.9,7.9,0,0,0,64,104a72,72,0,0,1,56-70.21V49.38a24,24,0,1,0,16,0V32c1.3,0,2.6,0,3.9.1A72.26,72.26,0,0,1,203.84,80H184a8,8,0,0,0-6.15,2.88L152.34,113.5a24.06,24.06,0,1,0,12.28,10.25L187.75,96h19.79q.36,3.12.44,6.3a72.26,72.26,0,0,1-28.78,59.3,8,8,0,0,0-3.14,7.39l8,64a8,8,0,0,0,7.93,7,8.39,8.39,0,0,0,1-.06,8,8,0,0,0,6.95-8.93ZM128,80a8,8,0,1,1,8-8A8,8,0,0,1,128,80Zm16,64a8,8,0,1,1,8-8A8,8,0,0,1,144,144Z"></path>
              </svg>
              Model
            </button>
            <button
              onClick={() => handleButtonClick("content2")}
              className={`flex  items-center border-2 border-blue-800 py-2 p-3  rounded-md text-white ${activeContent === "content2" ? "bg-[#5D5FEF]" : "bg-[#131330]"
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none" />
                <rect
                  x="24"
                  y="56"
                  width="208"
                  height="144"
                  rx="8"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                />
                <line
                  x1="56"
                  y1="136"
                  x2="72"
                  y2="136"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                />
                <line
                  x1="104"
                  y1="136"
                  x2="200"
                  y2="136"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                />
                <line
                  x1="56"
                  y1="168"
                  x2="152"
                  y2="168"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                />
                <line
                  x1="200"
                  y1="168"
                  x2="184"
                  y2="168"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="16"
                />
              </svg>
              Transcriber
            </button>
            <button
              onClick={() => handleButtonClick("content3")}
              className={`flex items-center border-2 border-blue-800 py-1 p-3 rounded-md text-white ${activeContent === "content3" ? "bg-[#5D5FEF]" : "bg-[#131330]"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                viewBox="0 0 256 256"
              >
                <path d="M56,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM88,24a8,8,0,0,0-8,8V224a8,8,0,0,0,16,0V32A8,8,0,0,0,88,24Zm40,32a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,128,56Zm40,32a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,168,88Zm40-16a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V80A8,8,0,0,0,208,72Z"></path>
              </svg>
              Voice
            </button>

            <button
              className={`flex items-center border-2 border-blue-800 py-1 p-3 rounded-md text-white ${activeContent === "content4" ? "bg-[#5D5FEF]" : "bg-[#131330]"
                }`}
              onClick={() => handleButtonClick("content4")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                viewBox="0 0 256 256"
              >
                <path d="M208,40a8,8,0,0,1-8,8H170.71a24,24,0,0,0-23.62,19.71L137.59,120H184a8,8,0,0,1,0,16H134.68l-10,55.16A40,40,0,0,1,85.29,224H56a8,8,0,0,1,0-16H85.29a24,24,0,0,0,23.62-19.71l9.5-52.29H72a8,8,0,0,1,0-16h49.32l10-55.16A40,40,0,0,1,170.71,32H200A8,8,0,0,1,208,40Z"></path>
              </svg>
              Functions
            </button>

            {
              assistantType != "service" &&
              <button className={`flex items-center border-2 border-blue-800 py-1 p-3 rounded-md gap-2 text-white ${activeContent === "content5" ? "bg-[#5D5FEF]" : "bg-[#131330]"
                }`} onClick={() => handleButtonClick("content5")}>
                <FaPhone />
                Twillo
              </button>
            }


            <button className="flex items-center border-2 border-blue-800 bg-[#131330] py-1 p-3  rounded-md text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                viewBox="0 0 256 256"
              >
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
              </svg>
              Advanced
            </button>
          </div>
          {activeContent === "content1" && (
            <div className="grid  grid-cols-2 w-[35rem] md:w-auto md:ml-40 md:-mt-[15.3rem] md:grid-cols-3 g">
              <div
                className="col-span-1 rounded-xl md:col-span-2 p-4 bg-zinc-70 -mr-3 "
                style={{ backgroundColor: "#25263F" }}
              >
                {/* <h2 className="text-sm font-normal mb-2 ">
                Please use <span className="text-red-400">{TWILLO_SERVER_URL}/incoming-call</span> for incoming calls.

                </h2> */}
                <h2 className="text-2xl font-normal mb-2 ">
                  Model{" "}
                  <span className="text-zinc-400 text-sm pl-3 mb-6">
                    This section allows you to configure the model for the
                    assistant.
                  </span>{" "}
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    First Filler
                  </label>
                  <input
                    className="p-3 w-full bg-zinc-900 rounded"
                    value={firstFillers && firstFillers}
                    onChange={(e) => setFirstFillers(e.target.value)}
                  />
                </div>
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    interruption keywords
                  </label>
                  <ReactTagInput
                    tags={fillers}
                    placeholder="Add interruption keywords"
                    onChange={handleTagChange}
                    style={{ backgroundColor: "red" }}
                  />
                </div> */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    System Prompt
                  </label>
                  <textarea
                    className="p-3 h-96 w-full bg-zinc-900 rounded resize-none text-white"
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    value={systemPrompt}
                  />
                </div>
              </div>
              <div
                className="p-4  bg-zinc-700 "
                style={{ backgroundColor: "#25263F" }}
              >

                {/* <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Provider
                  </label>
                  <select className="w-full p-2 bg-[#1F1B29] rounded text-white">
                    <option>openai</option>
                    <option>together-ai</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={handleChange}
                    className="w-full p-2 bg-[#1F1B29] rounded text-white"
                  >
                    <option>Anthropic</option>
                    <option>GPT 3.5</option>
                    <option>GPT 4.0</option>
                    <option>Claude</option>
                  </select>
                </div> */}


                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Knowledge Base
                  </label>
                  <select className="w-full p-2 bg-[#1F1B29] rounded text-white">
                    <option>No Documents Added</option>
                  </select>
                </div>


                {/* <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Temperature
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    className="w-full h-2 bg-[#1F1B29] rounded appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 bg-[#1F1B29] rounded text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Detect Speech Emotion
                  </label>
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-green-500 bg-zinc-800 rounded border-zinc-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Data Prompt
                  </label>
                  <textarea
                    className="p-3 h-32 w-full bg-zinc-900 rounded resize-none text-white"
                    onChange={(e) => setDataPrompt(e.target.value)}
                    value={dataPrompt}
                    placeholder="Example: You are english teacher and your job is to communicate other in English and point out their mistakes."
                  />
                </div> */}

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Add Document
                  </label>
                  <input
                    className="p-3 w-full bg-zinc-900 rounded resize-none text-white"
                    type="file"
                  />


                </div>


                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Placeholders</label>
                  <div className="w-full p-2 bg-[#1F1B29] rounded text-white">
                    {placeholders.length === 0 ? (
                      <p className="text-gray-400">No Placeholders Added</p>
                    ) : (
                      placeholders.map((pair, index) => (
                        <div key={index} className="flex gap-2 mb-2 items-center">
                          <input
                            type="text"
                            placeholder="Placeholder Key (e.g., airline_name)"
                            value={pair.key}
                            onChange={(e) => updatePlaceholder(index, "key", e.target.value)}
                            className="w-1/3 p-2 rounded bg-gray-700 text-white outline-none flex-1"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g., Emirates)"
                            value={pair.value}
                            onChange={(e) => updatePlaceholder(index, "value", e.target.value)}
                            className="w-1/3 p-2 rounded bg-gray-700 text-white outline-none flex-1"
                          />
                          {/* ❌ Remove Button */}
                          <button
                            onClick={() => removePlaceholder(index)}
                            className="text-sm bg-red-500 text-white h-5 w-5 rounded-full"
                          >
                            X
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={addPlaceholder}
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                  >
                    + Add Placeholder
                  </button>
                </div>

              </div>
            </div>
          )}

          {activeContent === "content2" && (
            <div className="md:ml-40 md:w-auto  w-[35rem] rounded-xl md:pr-[40rem] md:-mt-[15.3rem] bg-[#25263F] text-zinc-300 p-6">
              <h2 className="text-2xl font-semibold mb-2">Transcription</h2>
              <p className="text-zinc-400 mb-6">
                This section allows you to configure the transcription settings
                for the assistant.
              </p>
              <div className="mb-4">
                <label className="block text-zinc-400 mb-1" htmlFor="provider">
                  Provider
                </label>
                <select
                  id="provider"
                  className="w-full p-2 bg-[#1F1B29] rounded-md"
                >
                  <option>deepgram</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-zinc-400 mb-1" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  className="w-full p-2 bg-[#1F1B29] rounded-md"
                >
                  <option>English</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-zinc-400 mb-1" htmlFor="model">
                  Model
                </label>
                <select
                  id="model"
                  className="w-full p-2 bg-[#1F1B29] rounded-md"
                >
                  <option>deepgram</option>
                </select>
              </div>
            </div>
          )}
          {activeContent === "content3" && (
            <div className="p-6 rounded-xl md:w-auto w-[35rem] md:ml-40 md:-mt-[15.3rem]  bg-[#25263F]">
              <h2 className="text-xl font-semibold mb-2">
                Voice Configuration
              </h2>
              <p className="mb-4 text-sm">
                Choose from the list of voices, or sync your voice library if
                you aren't able to find your voice in the dropdown. If you are
                still facing any error, you can enable custom voice and add a
                voice ID manually.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className=" text-sm font-medium mb-1 flex gap-5 items-center">
                    VoiceID:
                    <p className="flex items-center">
                      <input
                        type="checkbox"
                        onClick={() => setShowDropdown(!showDropdown)}
                      ></input>
                      <label className="ml-2">
                        {showDropdown
                          ? "Wanna Give any Custum VoiceID "
                          : "Go for various Choices"}
                      </label>
                    </p>
                  </label>
                  {showDropdown ? (
                    <Select
                      options={options}
                      onChange={(selectedOption) =>
                        setVoiceID(selectedOption.value)
                      }
                      className="w-full py-1 bg-[#1F1B29] rounded"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: "#1F1B29",
                          border: "none",
                          boxShadow: "none",
                          "&:hover": {
                            border: "none",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "#1F1B29",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "white",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isFocused
                            ? "#3E2F5B"
                            : "#1F1B29",
                          color: "white",
                        }),
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={voiceID}
                      onChange={(e) => setVoiceID(e.target.value)}
                      className="w-full p-2.5 bg-[#1F1B29] rounded"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Voice Speed
                  </label>
                  <input
                    type="number"
                    value={audioSpeed}
                    onChange={(e) => setAudioSpeed(e.target.value)}
                    className="w-full p-2.5 bg-[#1F1B29] rounded"
                  ></input>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Additional Configuration
              </h3>
              <p className="mb-4 text-sm">
                Configure additional settings for the voice of your assistant.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Background Sound
                  </label>
                  <select className="w-full p-2.5 bg-[#1F1B29] rounded">
                    <option>deepgram</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Input Min Characters
                  </label>
                  <select className="w-full p-2.5 bg-[#1F1B29]  rounded">
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Punctuation
                  </label>
                  <select className="w-full p-2.5   bg-[#1F1B29]  rounded">
                    <option>deepgram</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm font-medium">
                    Filler Injection Enabled
                  </span>
                </label>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  This determines whether fillers are injected into the Model
                  output before inputting it into the Voice provider.
                </p>
              </div>
              <div className="mb-6">
                <label className="flex items-center mb-2">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm font-medium">
                    Backchanneling Enabled
                  </span>
                </label>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Make the bot say words like 'mhmm', 'ya' etc. while listening
                  to make the conversation sounds natural. Default disabled
                </p>
              </div>
              <h3 className="text-lg font-semibold mb-2">Model</h3>
              <p className="mb-4 text-sm">
                This is the model that will be used. Use eleven_multilingual_v2
                if transcriber.language is non-English, otherwise
                eleven_turbo_v2.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <select className="w-full p-2.5 bg-[#1F1B29] rounded">
                    <option>deepgram</option>
                  </select>
                </div>
              </div>
              <div className="mb-6 md:pr-[48rem] ">
                <label className="block text-sm font-medium mb-1">
                  Temperature
                </label>
                <input
                  type="range"
                  className="w-full"
                  min="0"
                  max="1"
                  step="0.01"
                />
              </div>
            </div>
          )}



          {activeContent === "content4" && (
            <FunctionConfiguration assistantId={idx.id} functions={functions} />
          )}

          {
            activeContent === "content5" && (
              <TwilloConfiguration twilioNumber={twilioNumber} setTwilioNumber={setTwilioNumber} handlePost={handlePost} />
            )
          }





        </div>
      </div>


      {
        openCall &&
        <CallDialoag assistant={assistant} onClose={() => setOpenCall(false)} />
      }
    </>
  );
};

export default ConfigurationDummy;
