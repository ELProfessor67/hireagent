import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ApllePodCastLogo from "../images/ApplePodcastsLogo.png";
import File from "../images/File.png";
import Headset from "../images/Headset.png";
import Phone1 from "../images/Phone.png";
import PhoneCall from "../images/PhoneCall.png";
import SpeakerHign from "../images/SpeakerHigh.png";
import WebhooksLogo from "../images/WebhooksLogo.png";
import TalkBetter from "../images/TalkBetter.png";
import Assistant from "./Assistant";
import axios from "axios"
import Phone from "./Phone";
import Documents from "./Documents";
import Voice from "./Voice";
import Api from "./Api";
import Call from "./Call";
import Confi from "./confi";
import Login from "../pages/Login";
import TemplateSelection from "./BlankPopUp";
import ConfigurationDummy from "../pages/ConfigurationDummy";
import "./Navbar.css";
import Profile from "./Profile";
import Overview from "./Overview";
import Squads from "./Squads";
import Provider from "./ProviderApi";
import Members from "../pages/Members";
import Settings from "../pages/Settings";
import { BACKEND_BASE_URL } from '../constant/URL'
import { FaBullseye, FaBuyNLarge } from "react-icons/fa";
import BuyAssistant from "./BuyAssistant";
import { MdQueryBuilder } from "react-icons/md";


const Sidebar = ({ openfun }) => {
  const [response, setResponse] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [assistants, setAssistants] = useState()
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
    if (userDetails) {
      setEmail(userDetails.email);
      setResponse(userDetails.name);
      setUserName(userDetails.name.slice(0, 1).toUpperCase());
      setRole(userDetails.role)
    }
  });


  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
      setIsPopupVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  console.log(email);

  const handleLogin = (userDetails) => {
    localStorage.setItem("UserDetails", JSON.stringify(userDetails));
    setResponse(userDetails.name);
    setUserName(userDetails.name.slice(0, 1).toUpperCase());
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("UserDetails");
    setResponse("");
    setUserName("");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const hideSidebarPaths = [
    "/login",
    "/register",
    "/demo",
    "/assistants",
    "/assistantlist",
    "/configured",
    "/chatbots",
    "/voicebots",
    "/blankpopup",
  ];

  const hideSidebarRegex = /^\/(assistant)\/.+$/;

  const shouldHideSidebar =
    hideSidebarPaths.includes(location.pathname) ||
    hideSidebarRegex.test(location.pathname);

  useEffect(() => {
    const fetchAssistants = async () => {
      const token = localStorage.getItem("Token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get(
          `${BACKEND_BASE_URL}/api/configs/findAllAssistants`,
          {
            headers: {
              Authorization: ` ${token}`,
            },
          }
        );
        setAssistants(response.data.data);
        // console.log(response.data.data)

      } catch (error) {
        console.error("Error fetching assistants", error);

      }
    };

    fetchAssistants();
  }, []);

  return (
    <div className="h-screen flex">
      {!shouldHideSidebar && (
        <div
          className={`${location.pathname === "/createassistant" && "absolute"
            } fixed left-0 flex flex-col rounded w-full cursor-pointer`}
        >
          <div className="w-full py-3 lg:pl-10 flex justify-between items-center pl-2 flex-col sm:flex-row gap-5">
            <img src={TalkBetter} className="h-10 w-64" alt="TalkBetter" />
            <div className="flex gap-5 items-center pr-5 relative">
              {
                role == "seller" &&
                <button
                  className="rounded-md p-3 bg-[#5D5FEF] text-white text-xs w-full"
                  onClick={() => navigate("/createassistant")}
                >
                  Create Assistant
                </button>
              }

              <button className="rounded-md text-xs p-3 bg-[#000000] text-white w-full">
                + Add AI for help
              </button>
              <div className="  gap-5  flex">
                <button
                  className={`${response ? "rounded-full text-xs" : "rounded-md text-xs"
                    } px-5 p-3 bg-[#5D5FEF] text-white`}
                  onClick={toggleDropdown}
                >
                  {userName ? (
                    userName
                  ) : (
                    <span onClick={() => navigate("/login")}>Login</span>
                  )}
                </button>
                {response && dropdownOpen && (
                  <button
                    className="block w-full px-4 py-2 text-sm bg-[#5D5FEF] text-white text-center rounded"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
          {open ? (
            <div className="lg:bottom-[2rem] flex fixed justify-between flex-col h-[86vh] pt-12 w-42 md:top-auto top-28 bg-[#000000] text-[#989BAC] lg:mx-5 mx-2 text-xs rounded-3xl bottom-[-1.2rem] sm:text-sm lg:w-64 sm:bottom-4">
              <div
                className="flex flex-col gap-2 font-sans px-3"
                onClick={() => {
                  setOpen(false), openfun(true);
                }}
              >
                <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] sm:p-2 p-1 rounded transition-all ${location.pathname === "/overview" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/overview")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="white"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm71.87,53.27L136,114.14V40.37A88,88,0,0,1,199.87,77.27ZM120,40.37v83l-71.89,41.5A88,88,0,0,1,120,40.37ZM128,216a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"></path>
                  </svg>
                  <h1>Overview</h1>
                </div>
                <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] sm:p-2 p-1 rounded transition-all ${location.pathname === "/" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/")}
                >
                  <img
                    src={ApllePodCastLogo}
                    alt="Assistants"
                    className="w-4 h-4 sm:w-9 sm:h-9"
                  />
                  <h1>Assistants</h1>
                </div>
                <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/phone" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/phone")}
                >
                  <img
                    src={Phone1}
                    alt="Phone Numbers"
                    className="w-4 h-4 sm:w-9 sm:h-9"
                  />
                  <h1>Phone Numbers</h1>
                </div>
                <div
                  className={`flex gap-1 sm:gap-3 items-center text-white hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/buy-assistant" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/buy-assistant")}
                >
                  <FaBullseye size={30} />
                  <h1>Buy Assistant</h1>
                </div>

                <a
                  className={`flex gap-1 sm:gap-3 items-center text-white hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/workflow" ? "active-tab" : ""
                    }`}
                  href="https://workflow.myrealmarket.com/"
                >

                  <MdQueryBuilder size={30} />
                  <h1>Workflows</h1>
                </a>


                <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/documents" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/documents")}
                >
                  <img
                    src={File}
                    alt="Documents"
                    className="w-4 h-4 sm:w-9 sm:h-9"
                  />
                  <h1>Documents</h1>
                </div>
                <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/squads" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/squads")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="white"
                    viewBox="0 0 256 256"
                  >
                    <path d="M116,128a12,12,0,1,1,12,12A12,12,0,0,1,116,128ZM84,140a12,12,0,1,0-12-12A12,12,0,0,0,84,140Zm88,0a12,12,0,1,0-12-12A12,12,0,0,0,172,140Zm60-76V192a16,16,0,0,1-16,16H83l-32.6,28.16-.09.07A15.89,15.89,0,0,1,40,240a16.13,16.13,0,0,1-6.8-1.52A15.85,15.85,0,0,1,24,224V64A16,16,0,0,1,40,48H216A16,16,0,0,1,232,64ZM40,224h0ZM216,64H40V224l34.77-30A8,8,0,0,1,80,192H216Z"></path>
                  </svg>
                  <h1>Squads</h1>
                </div>
                <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/voice" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/voice")}
                >
                  <img
                    src={SpeakerHign}
                    alt="Voice Library"
                    className="w-4 h-4 sm:w-9 sm:h-9"
                  />
                  <h1>Voice Library</h1>
                </div>
                <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/call" ? "active-tab" : ""
                    }`}
                  onClick={() => navigate("/call")}
                >
                  <img
                    src={PhoneCall}
                    alt="Call Logs"
                    className="w-4 h-4 sm:w-10 sm:h-10"
                  />
                  <h1>Call Logs</h1>
                </div>
                {/* <div
                  className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-1 sm:p-2 rounded ${
                    location.pathname === "/api" ? "active-tab" : ""
                  }`}
                  onClick={() => navigate("/api")}
                >
                  <img
                    src={WebhooksLogo}
                    alt="Provider APIs"
                    className="w-4 h-4 sm:w-10 sm:h-10"
                  />
                  <h1>Provider APIs</h1>
                </div> */}

              </div>

              <div
                className={`flex gap-1 md:mt-32 md:ml-2 sm:gap-3 items-center hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/profile" ? "active-tab" : ""
                  }`}
                onClick={() => navigate("/profile")}
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <h1>Profile</h1>
              </div>
              <div className="relative">
                <button
                  className="bg-zinc-900 md:ml-3 hover:bg-zinc-800 text-white flex items-center p-2 rounded-lg space-x-2 max-w-lg"
                  onClick={togglePopup}
                  ref={buttonRef}
                >
                  <div className="flex  items-center justify-center bg-teal-600 rounded-full w-8 h-8">
                    <svg
                      className="w-6 h-6 text-teal-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-5l4.5 2.5-4.5 2.5zm0-8L16 12 10 14.01v-5L10 8.5z" />
                    </svg>
                  </div>
                  <span className="flex-grow truncate">{email}</span>
                  <button className="flex items-center justify-center text-zinc-400"></button>
                </button>

                {isPopupVisible && (
                  <div ref={popupRef} className="absolute md:-top-80 w-60  backdrop-filter backdrop-blur-lg text-white p-4 rounded-lg shadow-md  dark:text-white">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-700 dark:border-zinc-700">
                      <span className="font-semibold">{email}'s Org</span>
                      <svg
                        className="w-4 h-4 text-zinc-500 dark:text-zinc-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6"></path>
                      </svg>
                    </div>
                    <div className="pt-3">
                      <p className="text-zinc-400 text-sm mb-3 dark:text-zinc-400">
                        Actions
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center hover:bg-zinc-700 p-2 rounded dark:hover:bg-zinc-700">
                          <span>Billing</span>
                        </li>
                        <li onClick={() => navigate("/members")} className="flex items-center hover:bg-zinc-700 p-2 rounded dark:hover:bg-zinc-700">
                          <span>Members</span>
                        </li>
                        <li onClick={() => navigate("/settings")} className="flex items-center hover:bg-zinc-700 p-2 rounded dark:hover:bg-zinc-700">
                          <span>Settings</span>
                        </li>
                        <li onClick={() => navigate("/apikeys")} className="flex items-center hover:bg-zinc-700 p-2 rounded dark:hover:bg-zinc-700">
                          <span>API Keys</span>
                        </li>
                        <li className="flex items-center hover:bg-zinc-700 p-2 rounded dark:hover:bg-zinc-700">
                          <span>Provider Credentials</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col rounded w-[101px] justify-between"
              onClick={() => {
                setOpen(true), openfun(true);
              }}
            >
              <div className="flex fixed flex-col bg-black h-[84vh] w-[72px] justify-between items-center mx-2 rounded-3xl pt-8 py-5 lg:bottom-12 transition-all top-[5rem] lg:top-[4.8rem] xxs:top-[7rem] sm:top-[5rem]">
                <div className="flex flex-col gap-4 items-center">
                  <div
                    onClick={() => navigate("/overview")}
                    className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/overview" ? "active-tab" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="white"
                      viewBox="0 0 256 256"
                    >
                      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm71.87,53.27L136,114.14V40.37A88,88,0,0,1,199.87,77.27ZM120,40.37v83l-71.89,41.5A88,88,0,0,1,120,40.37ZM128,216a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"></path>
                    </svg>
                  </div>
                  <div
                    onClick={() => navigate("/")}
                    className={`flex gap-1 sm:gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/" ? "active-tab" : ""
                      }`}
                  >
                    <img src={ApllePodCastLogo} alt="Assistants" />
                  </div>
                  <div
                    onClick={() => navigate("/phone")}
                    className={`flex gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/phone" ? "active-tab" : ""
                      }`}
                  >
                    <img src={Phone1} alt="Phone Numbers" />
                  </div>
                  <div
                    onClick={() => navigate("/buy-assistant")}
                    className={`flex gap-3 items-center text-white text-3xl hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/buy-assistant" ? "active-tab" : ""
                      }`}
                  >
                    <FaBullseye />
                  </div>

                  <a
                    className={`flex gap-1 sm:gap-3 items-center text-white hover:bg-[#383E5A] p-1 sm:p-2 rounded ${location.pathname === "/workflow" ? "active-tab" : ""
                      }`}
                    href="https://workflow.myrealmarket.com/"
                  >

                    <MdQueryBuilder size={30} />
                  </a>
                  <div
                    onClick={() => navigate('/documents')}
                    className={`flex gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/documents" ? "active-tab" : ""
                      }`}
                  >
                    <img src={File} alt="Documents" />
                  </div>
                  <div
                    onClick={() => navigate('/squads')}
                    className={`flex gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/squads" ? "active-tab" : ""
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="white"
                      viewBox="0 0 256 256"
                    >
                      <path d="M116,128a12,12,0,1,1,12,12A12,12,0,0,1,116,128ZM84,140a12,12,0,1,0-12-12A12,12,0,0,0,84,140Zm88,0a12,12,0,1,0-12-12A12,12,0,0,0,172,140Zm60-76V192a16,16,0,0,1-16,16H83l-32.6,28.16-.09.07A15.89,15.89,0,0,1,40,240a16.13,16.13,0,0,1-6.8-1.52A15.85,15.85,0,0,1,24,224V64A16,16,0,0,1,40,48H216A16,16,0,0,1,232,64ZM40,224h0ZM216,64H40V224l34.77-30A8,8,0,0,1,80,192H216Z"></path>
                    </svg>
                  </div>
                  <div
                    onClick={() => navigate("/voice")}
                    className={`flex gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/voice" ? "active-tab" : ""
                      }`}
                  >
                    <img src={SpeakerHign} alt="Voice Library" />
                  </div>
                  <div
                    onClick={() => navigate("/call")}
                    className={`flex gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/call" ? "active-tab" : ""
                      }`}
                  >
                    <img src={PhoneCall} alt="Call Logs" />
                  </div>
                  {/* <div
                    className={`flex gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${
                      location.pathname === "/api" ? "active-tab" : ""
                    }`}
                  >
                    <img src={WebhooksLogo} alt="Provider APIs" />
                  </div> */}
                </div>
                <div
                  onClick={() => navigate("/profile")}
                  className={`flex md:mt-20 gap-3 items-center hover:bg-[#383E5A] p-2 rounded ${location.pathname === "/profile" ? "active-tab" : ""
                    }`}
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="flex items-center justify-center bg-teal-600 rounded-full w-8 h-8">
                  <svg
                    className="w-6 h-6 text-teal-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-5l4.5 2.5-4.5 2.5zm0-8L16 12 10 14.01v-5L10 8.5z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex-grow">
        {location.pathname === "/login" ? (
          <Login />
        ) : location.pathname === "/" ? (
          response ? (
            response.length !== 0 ? (
              <Confi open={open} />
            ) : (
              <Assistant open={open} />
            )
          ) : (
            <Login />
          )
        ) : location.pathname === "/phone" ? (
          <Phone open={open} />
        ) : location.pathname === "/documents" ? (
          <Documents open={open} />
        ) : location.pathname === "/voice" ? (
          <Voice open={open} />
        ) : location.pathname === "/call" ? (
          <Call open={open} />
        ) : location.pathname === "/createassistant" ? (
          <TemplateSelection open={open} />
        ) : location.pathname === "/configurationdummyy/:id" ? (
          <ConfigurationDummy open={open} />
        ) : location.pathname === "/profile" ? (
          <Profile open={open} />
        ) : location.pathname === "/overview" ? (
          <Overview open={open} />
        ) : location.pathname === "/api" ? (
          <Provider open={open} />
        ) : location.pathname === "/squads" ? (
          <Squads open={open} />
        ) : location.pathname === "/members" ? (
          <Members open={open} />
        ) : location.pathname === "/settings" ? (
          <Settings email={email} open={open} />
        ) : location.pathname === "/apikeys" ? (
          <Provider open={open} />
        ) : location.pathname === "/buy-assistant" ? (
          <BuyAssistant open={open} />
        ) :
          (
            ""
          )}
      </div>
    </div>
  );
};

export default Sidebar;
