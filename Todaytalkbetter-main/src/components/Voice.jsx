import React, { useState } from "react";
import AudioBox from "../components/AudioBox";
import audioData from "../data/audioData.json";

const Voice = ({ open }) => {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [accent, setAccent] = useState("all");
  const [voiceEngine, setVoiceEngine] = useState("all");

  const filteredData = audioData.filter((audio) => {
    return (
      (gender === "all" || audio.gender === gender) &&
      (accent === "all" || audio.accent === accent) &&
      (voiceEngine === "all" || audio.voice_engine === voiceEngine) &&
      audio.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
          : "lg:w-[89%] lg:left-[10%] w-[70%] left-[25%]"
      } fixed overflow-y-scroll gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white   w-64 top-[6.9rem] sm:top-[4.9rem] `}
    >
      <div className="p-6">
        <div className="flex gap-4 mb-6">
           <select
            className="p-2 bg-[#121417] border border-gray-300 rounded"
            value={voiceEngine}
            onChange={(e) => setVoiceEngine(e.target.value)}
          >
            <option value="all">All</option>
            <option value="playht">PlayHT</option>
            <option value="11labs">11Labs</option>
          </select>
          <input
            type="text"
            placeholder="Search by name"
            className="p-2 bg-[#121417] border border-gray-300 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2 bg-[#121417] border border-gray-300 rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="neutral">Neutral</option>
          </select>
          <select
            className="p-2 bg-[#121417] border border-gray-300 rounded"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          >
            <option value="all">All</option>
            <option value="american">American</option>
            <option value="canadian">Canadian</option>
            <option value="british">British</option>
            <option value="indian">Indian</option>
          </select>
         
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((audio) => (
            <AudioBox key={audio.id} audio={audio} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Voice;
