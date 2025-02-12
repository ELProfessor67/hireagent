import React from 'react'

const Settings = ({open, email}) => {
  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[79%] xl:left-[20%] xm:w-[68%]"
          : "lg:w-[93%] lg:right-[3%] lg:left-[6%] w-[70%] left-[25%]"
      } absolute flex-col gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white flex justify-center items-center sm:top-[4.9rem] top-[6.9rem] overflow-hidden`}
    >

        <div className="p-4 mt-32 bg-zinc-950 text-white min-h-screen">
            <div className="flex items-center mb-6">
                <div className="bg-zinc-800 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 256 256"><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path></svg>
                  
                </div>
                <h1 className="ml-4 text-xl font-bold">{email}</h1>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-2">Server URL</h2>
                    <p className="text-zinc-400 mb-4">The URL of your Vapi server.</p>
                <label className="block mb-2">Organization ID</label>
                <div className="flex items-center bg-zinc-800 p-2 rounded">
                    <input type="text" className="bg-transparent flex-grow text-white outline-none" value="952b261e-34de-4be0-bfb0-dc2bc7259e5a" readonly/>
                    <button className="bg-zinc-800 p-1 rounded ml-2">
                        <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12h11v2H9zM9 7h11v2H9zm0 10h11v2H9zM3 17h4v-4H5.8l2.1-2.1L3 7l-1.9 1.9 2.1 2.1V17zm6 3H7v-7.9l-2.3 2.3-.7-.7 3-3 3 3-.7.7-2.3-2.3V20z"/></svg>
                    </button>
                </div>
        
                <label className="block mt-4 mb-2">Call Concurrency Limit</label>
                <input type="number" className="bg-zinc-800 p-2 rounded w-full text-white outline-none" value="10"/>
                
                <div className="flex items-center mt-4">
                    <input type="checkbox" className="bg-zinc-600 p-2 rounded text-white mr-2 outline-none" id="hipaa-enabled"/>
                    <label htmlFor="hipaa-enabled" className="text-zinc-400">HIPAA Enabled</label>
                </div>
                <p className="text-zinc-400 mt-2 text-sm">
                    Enabling HIPAA will disable storage of call recordings, logs or transcripts of any future calls.
                </p>
            </div>
        
            <div className="bg-zinc-900 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-2">Server URL</h2>
                <p className="text-zinc-400 mb-4">The URL of your Vapi server.</p>
                
                <label className="block mb-2">Server URL</label>
                <input type="text" className="bg-zinc-800 p-2 rounded w-full text-white outline-none" placeholder="No Server URL"/>
        
                <label className="block mt-4 mb-2">Server URL Secret</label>
                <input type="text" className="bg-zinc-800 p-2 rounded w-full text-white outline-none" placeholder="Server URL Secret"/>
            </div>
        </div>
        </div>
   </div>
   
     
  )
}

export default Settings

