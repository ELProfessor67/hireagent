import React, { useState, useEffect } from 'react';

const Squads = ({ open }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleNewSquadClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = (e) => {
    if (e.target.id === 'popup-overlay') {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.body.classList.add('blur-background');
    } else {
      document.body.classList.remove('blur-background');
    }

    return () => {
      document.body.classList.remove('blur-background');
    };
  }, [isPopupOpen]);

  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[79%] xl:left-[20%] xm:w-[68%]"
          : "lg:w-[93%] lg:right-[3%] lg:left-[6%] w-[70%] left-[25%]"
      } absolute flex-col gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white flex justify-center items-center sm:top-[4.9rem] top-[6.9rem] overflow-hidden`}
    >
      <button
        className="bg-[#131416] mt-9 py-2 px-14 rounded-lg md:mr-[55rem]"
        onClick={handleNewSquadClick}
      >
        <span className="mr-2">New Squad</span>
        <span className="text-zinc-200">+</span>
      </button>
      <div className="flex h-screen text-zinc-100">
        <div className="p-4"></div>
        <div className="flex flex-col justify-center items-center w-3/4">
          <h1 className="text-6xl font-bold">404</h1>
          <p className="mt-2 text-lg">Oops! We couldn't find this page.</p>
        </div>
      </div>

      {isPopupOpen && (
        <div
          id="popup-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleClosePopup}
        >
          <div className="max-w-sm w-full bg-[#131416]  p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <div className="bg-teal-500 p-4 rounded-full mb-4">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-white"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h2 className="text-xl text-zinc-800 dark:text-white font-bold mb-2">Build your Squad</h2>
              <p className="text-zinc-600 dark:text-zinc-300 mb-4 text-center">
                Enter the details for the new squad member.
              </p>
              <div className="w-full mb-4">
                <label className="block text-zinc-700 dark:text-zinc-200 mb-1">
                  Add Your First Member
                </label>
                <select className="w-full p-3 bg-[#131416] text-zinc-700 dark:text-zinc-300 rounded-lg">
                  <option>Add Member</option>
                </select>
              </div>
              <button className="w-full py-3 bg-[#5D5FEF] text-white font-bold rounded-lg mt-4">
                Create Squad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Squads;
