import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SpeechToText = ({ data }) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const recognitionRef = useRef(null);
  const socket = useRef(null);
  const audioContextRef = useRef(null);
  const audioBufferQueue = useRef([]);
  const isPlayingRef = useRef(false);
  const sourceNodeRef = useRef(null);

  useEffect(() => {
    socket.current = io("https://voicebots.trainright.fit", {
      query: { apiKey: data, isVoiceNeeded: true },
    });

    socket.current.on("connect", () => {
      setIsConnected(true);
    });

    socket.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.current.on("audio-chunk", async (chunk) => {
      try {
        console.log("Received chunk:", chunk);

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        }

        // Convert chunk to ArrayBuffer
        const audioData = new Uint8Array(chunk).buffer;
        console.log("Audio data buffer:", audioData);

        audioContextRef.current
          .decodeAudioData(audioData)
          .then((audioBuffer) => {
            console.log("Decoded audio buffer:", audioBuffer);
            audioBufferQueue.current.push(audioBuffer);
            if (!isPlayingRef.current) {
              playAudioQueue();
            }
          })
          .catch((error) => {
            console.error("Error decoding audio data:", error);
            console.log("Audio data as base64:", btoa(String.fromCharCode(...new Uint8Array(chunk))));
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
  }, [data]);

  const playAudioQueue = async () => {
    if (audioBufferQueue.current.length > 0) {
      setIsLoading(false);
      isPlayingRef.current = true;
      const audioBuffer = audioBufferQueue.current.shift();
      const sourceNode = audioContextRef.current.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioContextRef.current.destination);
      sourceNode.onended = () => {
        playAudioQueue();
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
    recognition.continuous = false;
    recognition.interimResults = false;
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
      setIsListening(false);
      setIsLoading(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      console.log("Speech recognition result:", transcript);
      socket.current.emit("message", transcript);
    };

    recognition.start();
    setIsListening(true);
  };

  return (
    <div>
      <div style={{ position: "fixed", top: "300px", right: "724px" }}>
        <button
          onClick={handleSpeech}
          disabled={isLoading}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: isListening
              ? "#FF5733"
              : isLoading
              ? "#FCA321"
              : "#4CAF50",
            color: "white",
            border: "none",
            fontSize: "16px",
            cursor: isLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          className="top-0"
        >
          {isListening ? (
            "Stop"
          ) : isLoading ? (
            <div className="linear-spinner"></div>
          ) : (
            "Speak"
          )}
        </button>
      </div>
      <style>
        {`
          .linear-spinner {
            position: absolute;
            width: 100%;
            height: 4px;
            background: white;
            animation: load 1s linear infinite;
          }

          @keyframes load {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SpeechToText;
