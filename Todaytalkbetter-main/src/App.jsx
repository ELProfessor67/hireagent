import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import Assistant from "./pages/Assistant";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Demo from "./pages/Demo";
import { useEffect, useState } from "react";
import Sidebar from "./components/Navbar";
import Configuration from "./pages/Configuration";
import "./pages/transition.css";
import Configure from "./pages/Configure";
import Phone from "./pages/Phone";
import AssistantDetails from "./components/AssistentbyId";
import Api from "./components/Api";
import Call from "./components/Call";
import AssistantList from "./components/AssistantList";
import Chatbot from "./pages/Chatbot";
import Voicebot from "./pages/Voicebot";
import BlankTemplatePopup1 from "./components/Blankpopup1";
import BlankTemplatePopup from "./components/BlankPopUp";
import ConfigurationDummy from "./pages/ConfigurationDummy";
import { data } from "autoprefixer";
import ChatbotModal from "./components/ChatbotModal";

function App() {
  const [showAssis, setShowSis] = useState(false);
  const [openstate, setOpenState] = useState(false);
  const [isdummy, setIsDummy] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  
  // const location = useLocation(); // hook to access the current location

  const isSpecialURL = location.pathname.slice(0, 20) === "/configurationdummyy";
  const buttonStyle = isSpecialURL ? { opacity: 0.5 } : { opacity: 1 };

  useEffect(() => {
    console.log("hii, Nilesh");
    console.log("Pathname changed:", location.pathname);
  }, [location.pathname]); // run the effect when pathname changes

  function showAsisFn(status) {
    setShowSis(status);
  }

  const openfun = (data) => {
    setOpenState(!openstate);
  };

  const isdummyfunc = (data) => {
    setIsDummy(data);
  };

  return (
    <div
      className={`bg-[#242323] w-full h-[100vh] ${
        "/configurationdummyy" === isdummy &&
        "md:h-[100vh] md:w-full w-[28rem]"
      } ${location.pathname === "/createassistant" && "h-[]"}`}
    >
      <BrowserRouter>
        <Sidebar openfun={openfun} />
        <Routes>
          <Route path="/assistants" element={<Assistant showAsisFn={showAsisFn} />} />
          <Route path="/assistant/:id" element={<AssistantDetails />} />
          <Route
            path="/configurationdummyy/:id"
            element={<ConfigurationDummy open={openstate} isdummyfunc={isdummyfunc} />}
          />
          <Route path="/configured" element={<Configure />} />
          <Route path="/assistantlist" element={<AssistantList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blankpopup" element={<BlankTemplatePopup />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/chatbots" element={<Chatbot />} />
        </Routes>
      </BrowserRouter>
      <div>
        <button
          className={
            "fixed flex justify-center items-center gap-2 bottom-10 text-center right-10 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg"
          }
          onClick={() => setIsChatbotOpen(true)}
          style={buttonStyle}
        >
          Ask AI <span className="text-[#5D5FEF] font-extrabold text-2xl">TB</span>
        </button>
        {isChatbotOpen && <ChatbotModal onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </div>
  );
}

export default App;
