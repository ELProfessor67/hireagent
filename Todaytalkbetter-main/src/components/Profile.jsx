import React from 'react'

const Profile = ({open}) => {
  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
          : "lg:w-[89%]  lg:left-[19%] w-[70%]   left-[25%]"
      } fixed  lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh]  rounded-3xl text-white  w-64 top-[6.9rem] sm:top-[4.9rem] `}
    >
        <div className=" text-white">
          <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="bg-[#131416] p-2 rounded-full mr-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold">Account</h1>
            </div>
            <div className="bg-[#131416] p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Settings</h2>
              <p className="text-zinc-400 mb-4">Customize your account details.</p>
              <form>
                <div className="mb-4">
                  <label className="block text-zinc-400 mb-1" htmlFor="email">Email</label>
                  <input type="email" id="email" className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-zinc-300" />
                </div>
                <div className="mb-4">
                  <label className="block text-zinc-400 mb-1" htmlFor="password">New Password</label>
                  <input type="password" id="password" className="w-full p-2 bg-zinc-700 rounded border border-zinc-600 text-zinc-300" />
                </div>
                <button className="w-full bg-[#5D5FEF] text-white py-2 px-4 rounded">Update New Password</button>
              </form>
            </div>
          </div>
        </div>
    </div>
    
  )
}

export default Profile