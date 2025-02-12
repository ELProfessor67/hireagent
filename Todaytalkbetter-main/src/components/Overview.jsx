import React from 'react'
import pie1 from "../assets/piechart.png"
import pie2 from "../assets/piechart2.png"

const Overview = ({open}) => {
  return (
    <div
    className={`${
      open
        ? "lg:w-[65%]  lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[79%] xl:left-[20%] xm:w-[68%]"
        : "lg:w-[93%] lg:right-[3%] lg:left-[6%] w-[70%] left-[25%]"
    } absolute   flex-col gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white flex justify-center items-center sm:top-[4.9rem] top-[6.9rem]  overflow-hidden`}
  >
    

    <div className="min-h-screen mt-32 md:overflow-auto overflow-y-scroll text-white p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Overview</h1>
        <select className="bg-zinc-700 p-2 rounded-full">
          <option value="Day">Day</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#1B1F22] p-4 rounded-lg">
          <h2 className="text-lg">Total Call Minutes</h2>
          <div className="text-4xl font-bold">4</div>
          <div className="text-green-500">+236.88%</div>
        </div>
        <div className="bg-[#1B1F22] p-4 rounded-lg">
          <h2 className="text-lg">Number of Calls</h2>
          <div className="text-4xl font-bold">6</div>
          <div className="text-green-500">+100.00%</div>
        </div>
        <div className="bg-[#1B1F22] p-4 rounded-lg">
          <h2 className="text-lg">Total Spent</h2>
          <div className="text-4xl font-bold">$0.51</div>
          <div className="text-green-500">+287.64%</div>
        </div>
        <div className="bg-[#1B1F22] p-4 rounded-lg">
          <h2 className="text-lg">Average Cost per Call</h2>
          <div className="text-4xl font-bold">$0.25</div>
          <div className="text-green-500">+100.00%</div>
        </div>
      </div>
      <div className="grid grid-cols-1  lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc- p-4  rounded-lg">
          <h2 className="flex items-center text-lg font-bold">
            <span className="mr-2">📞</span> Call Analysis
          </h2>
          <p className="mb-4 text-zinc-400">
            Here you can get a quick overview of how your calls are going within your organization.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#131416] p-4 rounded-lg">
              <h3 className="text-md font-semibold">Reason Call Ended</h3>
              <p className="text-zinc-400">
                Calls aggregated by reason of why the call ended or completed.
              </p>
              <img src={pie1} alt="Sample Chart" className="mt-4" />
            </div>
            <div className="bg-[#131416] p-4 rounded-lg">
              <h3 className="text-md font-semibold">Average Call Duration by Assistant</h3>
              <p className="text-zinc-400">Average call duration by assistant in minutes.</p>
              <img src={pie2} alt="Sample Chart" className="mt-4" />
            </div>
          </div>
        </div>
        <div className="bg-[#1C1D1F] mb-44 p-4 rounded-lg">
          <div>
          <h2 className="flex items-center text-lg font-bold">
            <span className="mr-2">👥</span> Assistants Table
          </h2>
          <p className="mb-4 text-zinc-400">
            Total calls and average call duration aggregated by assistant.
          </p>
          </div>
          
          <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Assistant Name</th>
                <th className="px-4 py-2">Call Count</th>
                <th className="px-4 py-2">Avg Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">Ava (Copy)</td>
                <td className="px-4 py-2">4</td>
                <td className="px-4 py-2">1.77 min</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Mary</td>
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">1.86 min</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
            <button className="bg-zinc-600 px-4 py-2 rounded">Previous</button>
            <div className="text-zinc-400">1</div>
            <button className="bg-zinc-600 px-4 py-2 rounded">Next</button>
          </div>
        </div>
      </div>
      
    </div>
</div>
  )
}

export default Overview
