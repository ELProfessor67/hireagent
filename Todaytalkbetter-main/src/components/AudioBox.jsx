import React, { useRef } from 'react';

function AudioBox({ audio }) {
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className="border border-gray-300 p-4 rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-2">{audio.name}</h2>
      <p><strong>ID:</strong> {audio.id}</p>
      <p><strong>Gender:</strong> {audio.gender}</p>
      <p><strong>Accent:</strong> {audio.accent}</p>
      <audio ref={audioRef} src={audio.sample} className="w-full mt-4" controls />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={togglePlayPause}
      >
        Play/Pause
      </button>
    </div>
  );
}

export default AudioBox;
