import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Getting from "./Getting";
import {BACKEND_BASE_URL} from '../constant/URL'

const Api = ({ open }) => {
  const data = [
    { id: 1, date: "Jun. 06 @ 6:51PM", source: "Web", description: "Web" },
    { id: 2, date: "May. 25 @ 1:33PM", source: "Web", description: "Web" },
    // Add more items as needed
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [response, setResponse] = useState();
  const filteredData = data.filter(
    (item) =>
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [indiResponse, setIndiResponse] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        let a = await axios.get(
          `${BACKEND_BASE_URL}/api/callLog/getCallLogs`
        );
        console.log(a.data);
        setResponse(a.data);
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchData();
  }, []);
  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
          : "lg:w-[89%] lg:left-[10%] w-[70%] left-[25%]"
      } fixed gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white w-64 top-[6.9rem] sm:top-[4.9rem]`}
    >
      <div className="grid grid-cols-3 h-fit">
        <div className="overflow-hidden h-screen bg-background p-4 w-4/5">
          <div className="flex p-4 sticky top-0 bg-background">
            <input
              type="text"
              placeholder="Search all columns..."
              className="flex h-9 w-full rounded-md text-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-transparent p-2 shadow border border-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div role="list" className="flex flex-col w-full p-4 overflow-auto">
            {response &&
              response.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col p-2.5 mb-1 rounded-lg w-full hover:bg-white/10 border border-white/0 hover:border-white/5 active:scale-95 cursor-pointer transition-all duration-100 ease-in-out"
                  onClick={() => setIndiResponse(item)}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{item.createdAt}</p>
                    <div className="flex gap-1.5 items-center overflow-hidden">
                      <p className="text-sm text-white/40">{item.type}</p>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 640 512"
                        color="#ffffff66"
                        height="12"
                        width="12"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          color: "rgba(255, 255, 255, 0.4)",
                          flex: "0 0 auto",
                        }}
                      >
                        <path d="M255.03 261.65c6.25 6.25 16.38 6.25 22.63 0l11.31-11.31c6.25-6.25 6.25-16.38 0-22.63L253.25 192l35.71-35.72c6.25-6.25 6.25-16.38 0-22.63l-11.31-11.31c-6.25-6.25-16.38-6.25-22.63 0l-58.34 58.34c-6.25 6.25-6.25 16.38 0 22.63l58.35 58.34zm96.01-11.3l11.31 11.31c6.25 6.25 16.38 6.25 22.63 0l58.34-58.34c6.25-6.25 6.25-16.38 0-22.63l-58.34-58.34c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63L386.75 192l-35.71 35.72c-6.25 6.25-6.25 16.38 0 22.63zM624 416H381.54c-.74 19.81-14.71 32-32.74 32H288c-18.69 0-33.02-17.47-32.77-32H16c-8.8 0-16 7.2-16 16v16c0 35.2 28.8 64 64 64h512c35.2 0 64-28.8 64-64v-16c0-8.8-7.2-16-16-16zM576 48c0-26.4-21.6-48-48-48H112C85.6 0 64 21.6 64 48v336h512V48zm-64 272H128V64h384v256z"></path>
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-white/67">{item.metadata}</p>
                </div>
              ))}
          </div>
        </div>
        <div
          className="css-9c0tyq py-10"
          data-testid="session-viewer-left-panel"
        >
          <div className="chakra-stack css-ahthbn">
            <div
              className="chakra-card !rounded-xl css-tv9qkx"
              data-testid="session-viewer-card"
            >
              <div
                className="chakra-card__body bg-muted rounded-xl css-1idwstw"
                data-testid="session-viewer-card-body"
              >
                <div
                  className="chakra-stack css-j7qwjs"
                  data-testid="session-viewer-stack"
                >
                  <div>
                    <div>
                      <div className="relative">
                        <h2 className="text-sm font-medium mb-2">Recording</h2>
                        <div id="wavesurfer--846bfed5-264e-4118-9d51-c13eda3fbf00">
                          <div></div>
                        </div>
                        <div>
                          <div className="chakra-spinner css-hno8u4">
                            <span className="css-8b45rq">Loading...</span>
                          </div>
                          Loading...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div dir="ltr" data-orientation="horizontal">
              <div
                role="tablist"
                aria-orientation="horizontal"
                className="inline-flex items-center justify-center text-muted-foreground overflow-x-auto p-1.5 gap-x-2 bg-muted/50 backdrop-blur-lg border border-white/5 rounded-xl shadow-lg shadow-black/5"
                data-testid="assistant-tabs-list"
                tabIndex="0"
                data-orientation="horizontal"
                style={{ outline: "none" }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected="true"
                  aria-controls="radix-:r14:-content-logs"
                  data-state="active"
                  id="radix-:r14:-trigger-logs"
                  className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50 focus:border data-[state=active]:shadow data-[state=active]:bg-primary-foreground/80 data-[state=active]:text-primary group rounded-[8px] gap-x-2 m-0 transition-all duration-100 ease-in-out active:scale-[0.95] text-white/50 hover:text-white/90"
                  title="Logs"
                  data-testid="assistant-tab-logs"
                  tabIndex="-1"
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  <svg
                    width="20.0391"
                    height="13.7598"
                    viewBox="0 0 20.0391 13.7598"
                    fill="'none' || '#000000'"
                    stroke="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[14px] w-[14px] fill-teal-300 transition-all"
                  >
                    <g>
                      <rect
                        height="13.7598"
                        opacity="0"
                        width="20.0391"
                        x="0"
                        y="0"
                      ></rect>
                      <path
                        d="M6.52344 13.5742L18.8867 13.5742C19.3262 13.5742 19.6777 13.2324 19.6777 12.793C19.6777 12.3438 19.3262 12.002 18.8867 12.002L6.52344 12.002C6.07422 12.002 5.73242 12.3438 5.73242 12.793C5.73242 13.2324 6.07422 13.5742 6.52344 13.5742Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M0.966797 13.7598L2.63672 13.7598C3.17383 13.7598 3.61328 13.3203 3.61328 12.793C3.61328 12.2461 3.17383 11.8164 2.63672 11.8164L0.966797 11.8164C0.429688 11.8164 0 12.2461 0 12.793C0 13.3203 0.429688 13.7598 0.966797 13.7598Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M6.52344 7.67578L18.8867 7.67578C19.3262 7.67578 19.6777 7.32422 19.6777 6.88477C19.6777 6.44531 19.3262 6.10352 18.8867 6.10352L6.52344 6.10352C6.07422 6.10352 5.73242 6.44531 5.73242 6.88477C5.73242 7.32422 6.07422 7.67578 6.52344 7.67578Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M0.966797 7.86133L2.63672 7.86133C3.17383 7.86133 3.61328 7.42188 3.61328 6.88477C3.61328 6.34766 3.17383 5.91797 2.63672 5.91797L0.966797 5.91797C0.429688 5.91797 0 6.34766 0 6.88477C0 7.42188 0.429688 7.86133 0.966797 7.86133Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M6.52344 1.76758L18.8867 1.76758C19.3262 1.76758 19.6777 1.42578 19.6777 0.986328C19.6777 0.537109 19.3262 0.195312 18.8867 0.195312L6.52344 0.195312C6.07422 0.195312 5.73242 0.537109 5.73242 0.986328C5.73242 1.42578 6.07422 1.76758 6.52344 1.76758Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M0.966797 1.95312L2.63672 1.95312C3.17383 1.95312 3.61328 1.51367 3.61328 0.986328C3.61328 0.439453 3.17383 0.00976562 2.63672 0.00976562L0.966797 0.00976562C0.429688 0.00976562 0 0.439453 0 0.986328C0 1.51367 0.429688 1.95312 0.966797 1.95312Z"
                        fillOpacity="0.85"
                      ></path>
                    </g>
                  </svg>
                  <span className="block text-white/90 transition-all">
                    Logs
                  </span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-controls="radix-:r14:-content-transcripts"
                  data-state="inactive"
                  id="radix-:r14:-trigger-transcripts"
                  className="inline-flex items-center justify-center whitespace-nowrap px-3 py-1 text-sm font-medium hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50 focus:border data-[state=active]:shadow data-[state=active]:bg-primary-foreground/80 data-[state=active]:text-primary group rounded-[8px] gap-x-2 m-0 transition-all duration-100 ease-in-out active:scale-[0.95] text-white/50 hover:text-white/90"
                  title="Transcripts"
                  data-testid="assistant-tab-transcripts"
                  tabIndex="-1"
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  <svg
                    width="20.0391"
                    height="16.8848"
                    viewBox="0 0 20.0391 16.8848"
                    fill="'none' || '#000000'"
                    stroke="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[14px] w-[14px] fill-teal-300 transition-all"
                  >
                    <g>
                      <rect
                        height="16.8848"
                        opacity="0"
                        width="20.0391"
                        x="0"
                        y="0"
                      ></rect>
                      <path
                        d="M1.09961 16.6074L4.58984 16.6074C4.98242 16.6074 5.29688 16.3027 5.29688 15.9004C5.29688 15.4883 4.98242 15.1836 4.58984 15.1836L1.09961 15.1836C0.6875 15.1836 0.371094 15.4883 0.371094 15.9004C0.371094 16.3027 0.6875 16.6074 1.09961 16.6074Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M10.2891 16.6074L18.9395 16.6074C19.3516 16.6074 19.666 16.3027 19.666 15.9004C19.666 15.4883 19.3516 15.1836 18.9395 15.1836L10.2891 15.1836C9.89648 15.1836 9.57227 15.4883 9.57227 15.9004C9.57227 16.3027 9.89648 16.6074 10.2891 16.6074Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M1.09961 12.7715L4.58984 12.7715C4.98242 12.7715 5.29688 12.457 5.29688 12.0547C5.29688 11.6426 4.98242 11.3379 4.58984 11.3379L1.09961 11.3379C0.6875 11.3379 0.371094 11.6426 0.371094 12.0547C0.371094 12.457 0.6875 12.7715 1.09961 12.7715Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M10.2891 12.7715L18.9395 12.7715C19.3516 12.7715 19.666 12.457 19.666 12.0547C19.666 11.6426 19.3516 11.3379 18.9395 11.3379L10.2891 11.3379C9.89648 11.3379 9.57227 11.6426 9.57227 12.0547C9.57227 12.457 9.89648 12.7715 10.2891 12.7715Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M1.09961 8.94531L4.58984 8.94531C4.98242 8.94531 5.29688 8.64062 5.29688 8.23828C5.29688 7.82617 4.98242 7.52148 4.58984 7.52148L1.09961 7.52148C0.6875 7.52148 0.371094 7.82617 0.371094 8.23828C0.371094 8.64062 0.6875 8.94531 1.09961 8.94531Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M10.2891 8.94531L18.9395 8.94531C19.3516 8.94531 19.666 8.64062 19.666 8.23828C19.666 7.82617 19.3516 7.52148 18.9395 7.52148L10.2891 7.52148C9.89648 7.52148 9.57227 7.82617 9.57227 8.23828C9.57227 8.64062 9.89648 8.94531 10.2891 8.94531Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M1.09961 5.09766L4.58984 5.09766C4.98242 5.09766 5.29688 4.793 5.29688 4.38086C5.29688 3.96875 4.98242 3.66406 4.58984 3.66406L1.09961 3.66406C0.6875 3.66406 0.371094 3.96875 0.371094 4.38086C0.371094 4.793 0.6875 5.09766 1.09961 5.09766Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M10.2891 5.09766L18.9395 5.09766C19.3516 5.09766 19.666 4.793 19.666 4.38086C19.666 3.96875 19.3516 3.66406 18.9395 3.66406L10.2891 3.66406C9.89648 3.66406 9.57227 3.96875 9.57227 4.38086C9.57227 4.793 9.89648 5.09766 10.2891 5.09766Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M1.09961 1.27148L4.58984 1.27148C4.98242 1.27148 5.29688 0.957031 5.29688 0.554688C5.29688 0.142578 4.98242 -0.162109 4.58984 -0.162109L1.09961 -0.162109C0.6875 -0.162109 0.371094 0.142578 0.371094 0.554688C0.371094 0.957031 0.6875 1.27148 1.09961 1.27148Z"
                        fillOpacity="0.85"
                      ></path>
                      <path
                        d="M10.2891 1.27148L18.9395 1.27148C19.3516 1.27148 19.666 0.957031 19.666 0.554688C19.666 0.142578 19.3516 -0.162109 18.9395 -0.162109L10.2891 -0.162109C9.89648 -0.162109 9.57227 0.142578 9.57227 0.554688C9.57227 0.957031 9.89648 1.27148 10.2891 1.27148Z"
                        fillOpacity="0.85"
                      ></path>
                    </g>
                  </svg>
                  <span className="block text-white/90 transition-all">
                    Transcripts
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="chakra-card bg-muted  h-screen  "
          data-testid="session-viewer-right-panel-card"
          style={{ overflowY: "auto" }}
        >
          <Getting indiResponse={indiResponse} />
        </div>
      </div>
    </div>
  );
};

export default Api;
