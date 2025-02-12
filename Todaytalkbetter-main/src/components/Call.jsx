import React, { useState, useEffect } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import {BACKEND_BASE_URL} from '../constant/URL'

// Form Popup Component
const FormPopup = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    llmName: "",
    gender: "",
    audioFile: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      audioFile: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("llmName", formData.llmName);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("audioFile", formData.audioFile);

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/voice/saveAudio`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("post", response.data);
      onSubmit(response.data);
    } catch (error) {
      console.error("Error posting audio file:", error);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Save Voice</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="llmName">
              llmName
            </label>
            <input
              type="text"
              id="llmName"
              name="llmName"
              value={formData.llmName}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="audioFile">
              Upload MP3
            </label>
            <input
              type="file"
              id="audioFile"
              name="audioFile"
              accept="audio/mp3"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// Main Call Component
const Call = ({ open }) => {
  const [response, setResponse] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/voice/getAllAudio`
        );
        console.log("voices", response.data.voices);
        setResponse(response.data.voices);
      } catch (error) {
        console.error("Error fetching voices:", error);
      }
    };
    fetchData();
  }, []);

  const handleSaveClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleSubmit = (data) => {
    console.log("New voice added:", data);
    setResponse((prev) => [...prev, data]);
    setIsPopupOpen(false);
  };
  const arrayBufferToBlobURL = (arrayBuffer, type) => {
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type });
    return URL.createObjectURL(blob);
  };
  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
          : "lg:w-[89%] lg:left-[10%] w-[70%] left-[25%]"
      } fixed gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white w-64 top-[6.9rem] sm:top-[4.9rem]`}
    >
      <div className="p-6 flex flex-wrap gap-2 pt-4 overflow-hidden">
        <div className="space-y-1">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 pl-0.5">
            Search
          </label>
          <div className="flex">
            <div className="space-y-1">
              <button
                type="button"
                role="combobox"
                aria-controls="radix-:rie:"
                aria-expanded="false"
                aria-autocomplete="none"
                dir="ltr"
                data-state="closed"
                className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-[hsl(240,5%,50%)] focus:outline-none focus:ring-1 focus:ring-ring focus:border disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 min-w-28 rounded-r-none border-r-0"
              >
                <span style={{ pointerEvents: "none" }}>11labs</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 opacity-50"
                  aria-hidden="true"
                >
                  <path
                    d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.35753 11.9939 7.64245 11.9939 7.81819 11.8182L10.0682 9.56819Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="relative grow shrink-0 basis-auto">
              <input
                type="text"
                className="peer grow shrink-0 basis-auto flex h-9 w-full rounded-l-none border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border"
                placeholder="Search... "
              />
              <div className="absolute top-0 right-1.5 bottom-0 flex flex-col items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 21l-4.35-4.35"></path>
                  <circle cx="11" cy="11" r="6"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-10">
          <button
            className="px-5 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleSaveClick}
          >
            Save Voice
          </button>
        </div>
        {isPopupOpen && (
          <FormPopup onClose={handleClosePopup} onSubmit={handleSubmit} />
        )}
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        {response &&
          response.map((voice, index) => (
            <div
            key={index}
            className="flex items-center py-2 border-b border-gray-200"
            >
             { console.log(voice)}
             <audio controls src={arrayBufferToBlobURL(voice.audioFile.data, 'audio/mp3')} />
              <div className="flex-grow">
                <div className="text-sm font-medium">{voice.llm}</div>
                <div className="text-xs text-gray-500">{voice.gender}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Call;
