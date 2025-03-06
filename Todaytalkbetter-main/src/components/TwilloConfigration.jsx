import React, { useState } from "react";
import { BACKEND_BASE_URL, TWILLO_SERVER_URL } from "../constant/URL";
import axios from "axios";
import { validatePhoneNumber } from "../utils/validatePhoneNumber";

function TwilloConfiguration({ twilioNumber, setTwilioNumber, handlePost }) {
    const [loading, setLoading] = useState(false);
    const [validErr, setValidateErr] = useState(null);
    const handleSubmit = async () => {
        if (!validatePhoneNumber(twilioNumber)) {
            setValidateErr(" The phone number must include the country code and have 10 digits ex: +11234567890");
            return
        }
        setValidateErr(null)
        setLoading(false)
        await handlePost();

        setLoading(true)
    }

    return (
        <div className="p-6 rounded-xl md:w-auto w-[35rem] md:ml-40 md:-mt-[15.3rem]  bg-[#25263F]">

            <h2 className="text-2xl font-semibold text-white mb-4">
                Twillo Configuration
            </h2>

            {
                twilioNumber &&
                <h2 className="text-sm font-normal mb-5 ">
                   
                    <p>You must add `<span className="text-red-400">{TWILLO_SERVER_URL}/incoming-call</span>` to your Twilio number configuration.</p>
                   
                </h2>
            }

            <div className="mb-4">
                <label className="block text-sm font-medium text-white mb-2">
                    Number
                </label>
                <input
                    type="text"
                    value={twilioNumber}
                    onChange={(e) => setTwilioNumber(e.target.value)}
                    className="w-full p-2 bg-[#1F1B29] rounded text-white"
                />
                {
                    validErr &&
                    <p className="text-red-500 mt-1">{validErr}</p>
                }
            </div>



            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 p-2 rounded text-white hover:bg-blue-700"
            >
                {loading ? "Loading..." : "Submit Configuration"}
            </button>
        </div>
    );
}

export default TwilloConfiguration;
