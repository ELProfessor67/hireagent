import { data } from "autoprefixer";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { audioContext, base64ToArrayBuffer } from '../utils/utils';
import { AudioStreamer } from '../services/audioStreamer';
import VolMeterWorket from '../services/workers/volMeter';

const AudioStreamerPage = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const websocketRef = useRef(null);
    const sessionIdRef = useRef(null);
    const audioStreamerRef = useRef(null);
    const [isSpeaking, setIsAISpeaking] = useState(false);
    const [volume,setVolume] = useState(0);


    useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" }).then((audioCtx) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx, setIsAISpeaking);
        audioStreamerRef.current
          .addWorklet("vumeter-out", VolMeterWorket, (ev) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            console.log('successfully initialize')
            // Successfully added worklet
          });
      });
    }
  }, [audioStreamerRef]);


    const startCall = async () => {
        sessionIdRef.current = uuidv4()
        try {
            const response = await fetch("http://localhost:5002/incoming-call-web", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    id: "67c8c284ea47171b774f43c1",
                    sessionId: sessionIdRef.current,
                }).toString(),
            });

            const data = await response.json();
            if (data.stream_url) {
                console.log("WebSocket URL:", data.stream_url);
                startStreaming(data.stream_url);
            } else {
                console.error("Invalid response:", data);
            }
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    const startStreaming = async (webSocketUrl) => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("getUserMedia not supported in this browser.");
            return;
        }

        try {
            const wsConnection = new WebSocket(webSocketUrl);
            wsConnection.binaryType = "arraybuffer";

            wsConnection.onopen = async () => {
                console.log("Connected to WebSocket");
                websocketRef.current = wsConnection;
                setIsStreaming(true);
                startSession();
                sendMedia();
            };

            wsConnection.onmessage = (message) => {
                handleOnMessage(message);
            }

            wsConnection.onclose = () => {
                console.log("WebSocket closed");
                setIsStreaming(false);
            };

            wsConnection.onerror = (error) => {
                console.error("WebSocket error:", error);
            };
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const startSession = () => {
        const message = {
            event: "start",
            start: {
                callSid: sessionIdRef.current,
                streamSid: sessionIdRef.current
            }
        }

        websocketRef.current.send(JSON.stringify(message));
    }


    const sendMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext({ sampleRate: 8000 }); // Set to 8000 Hz
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            const outputData = new Int16Array(inputData.length);

            for (let i = 0; i < inputData.length; i++) {
                outputData[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
            }

            // Convert Int16Array to Base64
            const uint8Array = new Uint8Array(outputData.buffer);
            const base64String = btoa(String.fromCharCode(...uint8Array));

            if (websocketRef.current.readyState === WebSocket.OPEN) {
                const message = {
                    event: "media",
                    media: {
                        payload: base64String
                    }
                };
                websocketRef.current.send(JSON.stringify(message));
            }
        };
    };



    const handleOnMessage = (message) => {
        const data = JSON.parse(message.data);
        switch(data.event){
            case "media":
                const media = data.media.payload;
                const buffer = base64ToArrayBuffer(media);
                audioStreamerRef.current?.addPCM16(new Uint8Array(buffer));
        }
    }

    return (
        <div>
            <button onClick={startCall} disabled={isStreaming}>
                {isStreaming ? "Streaming..." : "Start Call"}
            </button>
        </div>
    );
};

export default AudioStreamerPage;
