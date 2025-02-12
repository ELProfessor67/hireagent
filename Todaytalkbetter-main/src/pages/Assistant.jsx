import { Link } from "react-router-dom";

export default function Widget() {
  
  return (
    <div className="bg-zinc-800 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">
          Let's create your first assistant!
        </h1>
        <p className="text-zinc-400 mb-4">
          Here's a few templates to get you started:
        </p>
        <div className="space-y-4">
          <div className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Appointment Setter</h2>
              <p className="text-zinc-400 text-sm">
                For dental practices to demonstrate appointment setting. 13
                utterances and examples showing emerging components.
              </p>
            </div>
            <span className="text-zinc-500">100-120</span>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Customer Support</h2>
              <p className="text-zinc-400 text-sm">
                For retail websites to demonstrate appointment setting. 15
                utterances and examples showing emerging components.
              </p>
            </div>
            <span className="text-zinc-500">100-120</span>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Inbound Q/A</h2>
              <p className="text-zinc-400 text-sm">
                For dental practices to demonstrate appointment setting. 15
                examples against schedules, showing emerging components.
              </p>
            </div>
            <span className="text-zinc-500">100-120</span>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Game NPC</h2>
              <p className="text-zinc-400 text-sm">
                For novel practices to demonstrate appointment setting. 13
                utterances and examples showing emerging components.
              </p>
            </div>
            <span className="text-zinc-500">100-120</span>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Create template</h2>
              <p className="text-zinc-400 text-sm">
                For dental practices to demonstrate appointment setting. 15
                examples against schedules, showing emerging components.
              </p>
            </div>
            <span className="text-zinc-500">Custom</span>
          </div>
        </div>
        <div className="flex justify-between mt-8">
        <Link to="/">
            <button className="text-white px-4 py-2 rounded-lg">Back</button>
          </Link>
          <Link to="/blankpopup">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-lg ml-2"
            
          >
            Continue
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}




