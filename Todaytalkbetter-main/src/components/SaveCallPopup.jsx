import React, { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {BACKEND_BASE_URL} from '../constant/URL'

const SaveCallPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    endedReason: "",
    metadata: "",
    assistant: "",
    userPhoneNumber: "",
    phoneNumber: "",
    type: "",
    startedAt: new Date(),
    endedAt: new Date(),
    cost: "",
    id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      await axios.post(
        `${BACKEND_BASE_URL}/api/callLog/saveCallLog`,
        formData
      );
      console.log("Data posted successfully");
    } catch (error) {
      console.error("Error posting data:", error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-6 rounded-lg border-white border-2">
        <h2 className="text-xl font-bold mb-4">Save Call</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="endedReason">Ended Reason</label>
              <input
                type="text"
                id="endedReason"
                name="endedReason"
                value={formData.endedReason}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="metadata">Metadata</label>
              <input
                type="text"
                id="metadata"
                name="metadata"
                value={formData.metadata}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="assistant">Assistant</label>
              <input
                type="text"
                id="assistant"
                name="assistant"
                value={formData.assistant}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="userPhoneNumber">User Phone Number</label>
              <input
                type="text"
                id="userPhoneNumber"
                name="userPhoneNumber"
                value={formData.userPhoneNumber}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="type">Type</label>
              <input
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="startedAt">Started At</label>
              <DatePicker
                selected={formData.startedAt}
                onChange={(date) => handleDateChange(date, "startedAt")}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="endedAt">Ended At</label>
              <DatePicker
                selected={formData.endedAt}
                onChange={(date) => handleDateChange(date, "endedAt")}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="cost">Cost</label>
              <input
                type="text"
                id="cost"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
            <div>
              <label htmlFor="id">ID</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 w-full text-black"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveCallPopup;
