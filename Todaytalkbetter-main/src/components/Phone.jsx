import React, { useState } from "react";

const Phone = ({open}) => {
  const [selectedTab, setSelectedTab] = useState("twilio");
  const [twilioNumber, setTwilioNumber] = useState("");
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioSecret, setTwilioSecret] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [label, setLabel] = useState("");
  const [showdiologbox, setshowdiologbox] = useState(false);
  const [phoneId, setPhoneId] = useState(null);
  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
          : "lg:w-[89%] lg:left-[10%] w-[70%] left-[25%]"
      } fixed  lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white  w-64 top-[6.9rem] sm:top-[4.9rem] `}
    >
      {showdiologbox && (
        <div>
          <div
            role="dialog"
            aria-describedby="import-phone-number-description"
            aria-labelledby="import-phone-number-title"
            className="fixed left-[50%] top-[50%] bg-black z-50 grid max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg w-auto"
            tabIndex="-1"
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex flex-col space-y-1.5 text-center sm:text-left ">
              <h2
                id="import-phone-number-title"
                className="text-lg font-semibold leading-none tracking-tight pb-2"
              >
                Import Phone Number
              </h2>
            </div>
            <div dir="ltr" className="w-[400px]">
              <div
                role="tablist"
                aria-orientation="horizontal"
                className="inline-flex items-center justify-center rounded-lg bg-muted p-0 text-muted-foreground w-full mb-2"
                tabIndex="0"
                style={{ outline: "none" }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === "twilio"}
                  aria-controls="twilio-content"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1 ml-1 text-sm font-medium hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50 focus:border ${
                    selectedTab === "twilio"
                      ? "shadow bg-primary-foreground/80 text-primary"
                      : ""
                  } flex-1 cursor-pointer`}
                  tabIndex="-1"
                  onClick={() => handleTabClick("twilio")}
                >
                  Twilio
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedTab === "vonage"}
                  aria-controls="vonage-content"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1 ml-1 text-sm font-medium hover:bg-white/5 disabled:pointer-events-none disabled:opacity-50 focus:border ${
                    selectedTab === "vonage"
                      ? "shadow bg-primary-foreground/80 text-primary"
                      : ""
                  } flex-1 cursor-pointer`}
                  tabIndex="-1"
                  onClick={() => handleTabClick("vonage")}
                >
                  Vonage
                </button>
              </div>
              <div
                role="tabpanel"
                aria-labelledby="twilio-tab"
                id="twilio-content"
                className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-col gap-4 ${
                  selectedTab === "twilio" ? "" : "hidden"
                }`}
              >
                <div
                  className="space-y-2"
                  data-testid="form-item-twilio-number"
                >
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                    htmlFor="twilio-number"
                  >
                    Twilio Phone Number
                  </label>
                  <div className="flex w-full PhoneInput">
                    <button
                      className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:border outline-1 outline-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-e-none rounded-s-lg pl-3 pr-1 flex gap-1"
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="country-code"
                    >
                      <span className="flex items-center truncate">
                        <div className="bg-foreground/20 rounded-sm flex w-6 h-4">
                          <span className="inline object-contain w-6 h-4 overflow-hidden rounded-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 513 342"
                            >
                              <title>US</title>
                              <path fill="#FFF" d="M0 0h513v342H0z"></path>
                              <path
                                d="M0 0h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.7h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513V342H0z"
                                fill="#D80027"
                              ></path>
                              <path
                                fill="#2E52B2"
                                d="M0 0h256.5v184.1H0z"
                              ></path>
                              <path
                                d="m47.8 138.9-4-12.8-4.4 12.8H26.2l10.7 7.7-4 12.8 10.9-7.9 10.6 7.9-4.1-12.8 10.9-7.7zm56.3 0-4.1-12.8-4.2 12.8H82.6l10.7 7.7-4 12.8 10.7-7.9 10.8 7.9-4-12.8 10.7-7.7zm56.5 0-4.3-12.8-4 12.8h-13.5l11 7.7-4.2 12.8 10.7-7.9 11 7.9-4.2-12.8 10.7-7.7zm56.2 0-4-12.8-4.2 12.8h-13.3l10.8 7.7-4 12.8 10.7-7.9 10.8 7.9-4.3-12.8 11-7.7zM100 75.3l-4.2 12.8H82.6L93.3 96l-4 12.6 10.7-7.8 10.8 7.8-4-12.6 10.7-7.9h-13.4zm-56.2 0-4.4 12.8H26.2L36.9 96l-4 12.6 10.9-7.8 10.6 7.8L50.3 96l10.9-7.9H47.8zm112.5 0-4 12.8h-13.5l11 7.9-4.2 12.6 10.7-7.8 11 7.8-4.2-12.6 10.7-7.9h-13.2zm56.5 0-4.2 12.8h-13.3l10.8 7.9-4 12.6 10.7-7.8 10.8 7.8-4.3-12.6 11-7.9h-13.5zm-169-50.6-4.4 12.6H26.2l10.7 7.9-4 12.7L43.8 50l10.6 7.9-4.1-12.7 10.9-7.9H47.8zm56.2 0-4.2 12.6H82.6l10.7 7.9-4 12.7L100 50l10.8 7.9-4-12.7 10.7-7.9h-13.4zm56.3 0-4 12.6h-13.5l11 7.9-4.2 12.7 10.7-7.9 11 7.9-4.2-12.7 10.7-7.9h-13.2zm56.5 0-4.2 12.6h-13.3l10.8 7.9-4 12.7 10.7-7.9 10.8 7.9-4.3-12.7 11-7.9h-13.5z"
                                fill="#FFF"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        <span className="pl-2 text-sm">US +1</span>
                      </span>
                    </button>
                    <input
                      className="flex h-9 w-full rounded-lg rounded-l-none border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      type="tel"
                      id="twilio-number"
                      name="twilio-number"
                      placeholder="Enter your phone number"
                      value={twilioNumber}
                      onChange={(e) => setTwilioNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2" data-testid="form-item-twilio-sid">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                    htmlFor="twilio-sid"
                  >
                    Twilio SID
                  </label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    id="twilio-sid"
                    name="twilio-sid"
                    placeholder="Enter your Twilio SID"
                    value={twilioSid}
                    onChange={(e) => setTwilioSid(e.target.value)}
                  />
                </div>
                <div
                  className="space-y-2"
                  data-testid="form-item-twilio-secret"
                >
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                    htmlFor="twilio-secret"
                  >
                    Twilio Secret
                  </label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    id="twilio-secret"
                    name="twilio-secret"
                    placeholder="Enter your Twilio Secret"
                    value={twilioSecret}
                    onChange={(e) => setTwilioSecret(e.target.value)}
                  />
                </div>
                <div className="space-y-2" data-testid="form-item-label">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
                    htmlFor="label"
                  >
                    Label
                  </label>
                  <input
                    className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    id="label"
                    name="label"
                    placeholder="Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div
              role="tabpanel"
              aria-labelledby="vonage-tab"
              id="vonage-content"
              className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-col gap-4 ${
                selectedTab === "vonage" ? "" : "hidden"
              }`}
            >
              <div
                id="vonage-content"
                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-col gap-4"
                hidden={selectedTab !== "Vonage"}
              >
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none text-muted-foreground"
                    htmlFor="vonage-phone-number"
                  >
                    Vonage Phone Number
                  </label>
                  <div className="flex w-full PhoneInput">
                    <button
                      className="items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:border outline-1 outline-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-e-none rounded-s-lg pl-3 pr-1 flex gap-1"
                      type="button"
                      aria-haspopup="dialog"
                      aria-expanded="false"
                      aria-controls="country-code-dialog"
                      data-state="closed"
                    >
                      <span className="flex items-center truncate">
                        <div className="bg-foreground/20 rounded-sm flex w-6 h-4">
                          <span className="inline object-contain w-6 h-4 overflow-hidden rounded-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 513 342"
                            >
                              <title>US</title>
                              <path fill="#FFF" d="M0 0h513v342H0z"></path>
                              <path
                                d="M0 0h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513v26.3H0zm0 52.7h513v26.3H0zm0 52.6h513v26.3H0zm0 52.6h513V342H0z"
                                fill="#D80027"
                              ></path>
                              <path
                                fill="#2E52B2"
                                d="M0 0h256.5v184.1H0z"
                              ></path>
                              <path
                                d="m47.8 138.9-4-12.8-4.4 12.8H26.2l10.7 7.7-4 12.8 10.9-7.9 10.6 7.9-4.1-12.8 10.9-7.7zm56.3 0-4.1-12.8-4.2 12.8H82.6l10.7 7.7-4 12.8 10.7-7.9 10.8 7.9-4-12.8 10.7-7.7zm56.5 0-4.3-12.8-4 12.8h-13.5l11 7.7-4.2 12.8 10.7-7.9 11 7.9-4.2-12.8 10.7-7.7zm56.2 0-4-12.8-4.2 12.8h-13.3l10.8 7.7-4 12.8 10.7-7.9 10.8 7.9-4.3-12.8 11-7.7zM100 75.3l-4.2 12.8H82.6L93.3 96l-4 12.6 10.7-7.8 10.8 7.8-4-12.6 10.7-7.9h-13.4zm-56.2 0-4.4 12.8H26.2L36.9 96l-4 12.6 10.9-7.8 10.6 7.8L50.3 96l10.9-7.9H47.8zm112.5 0-4 12.8h-13.5l11 7.9-4.2 12.6 10.7-7.8 11 7.8-4.2-12.6 10.7-7.9h-13.2zm56.5 0-4.2 12.8h-13.3l10.8 7.9-4 12.6 10.7-7.8 10.8 7.8-4.3-12.6 11-7.9h-13.5zm-169-50.6-4.4 12.6H26.2l10.7 7.9-4 12.7L43.8 50l10.6 7.9-4.1-12.7 10.9-7.9H47.8zm56.2 0-4.2 12.6H82.6l10.7 7.9-4 12.7L100 50l10.8 7.9-4-12.7 10.7-7.9h-13.4zm56.3 0-4 12.6h-13.5l11 7.9-4.2 12.7 10.7-7.9 11 7.9-4.2-12.7 10.7-7.9h-13.2zm56.5 0-4.2 12.6h-13.3l10.8 7.9-4 12.7 10.7-7.9 10.8 7.9-4.3-12.7 11-7.9h-13.5z"
                                fill="#FFF"
                              ></path>
                            </svg>
                          </span>
                        </div>
                      </span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 "
                      >
                        <path
                          d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="+14156021922"
                      id="vonage-phone-number"
                      aria-describedby="vonage-phone-number-description"
                      aria-invalid="false"
                      className="flex h-9 w-full rounded-md text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border bg-transparent px-3 py-1 rounded-s-none rounded-e-lg placeholder:text-placeholder PhoneInputInput border-input"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div role="group" className="chakra-form-control">
                    <label htmlFor="api-key" className="chakra-form__label">
                      API Key
                    </label>
                    <div className="chakra-input__group">
                      <input
                        placeholder="Enter API Key"
                        type="text"
                        className="chakra-input !bg-black/20 w-full border-2 p-2 my-1 rounded-md"
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                    </div>
                  </div>
                  <div role="group" className="chakra-form-control">
                    <label htmlFor="api-secret" className="chakra-form__label">
                      API Secret
                    </label>
                    <div className="chakra-input__group">
                      <input
                        placeholder="Enter API Secret"
                        type="text"
                        className="chakra-input !bg-black/20 w-full border-2 p-2 my-1 rounded-md"
                        id="api-secret"
                        value={apiSecret}
                        onChange={(e) => setApiSecret(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none text-muted-foreground"
                    htmlFor="phone-number-label"
                  >
                    Label
                  </label>
                  <input
                    name="label"
                    placeholder="Label for Phone Number"
                    id="phone-number-label"
                    aria-describedby="phone-number-label-description"
                    aria-invalid="false"
                    className="flex h-9 w-full rounded-md text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[hsl(240,5%,50%)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 border bg-transparent px-3 py-1 border-input"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus:border outline-1 outline-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground w-auto px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus:border outline-1 outline-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 w-auto px-4 py-2"
                >
                  Import Number
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`flex h-full flex-1 ${showdiologbox && "blur-sm"}`}
        data-testid="content-wrapper"
      >
        <div data-testid="phone-numbers-container" className="flex flex-col">
          <div
            className="flex flex-row gap-2 p-4 border-b border-white/5"
            data-testid="buttons-wrapper"
          >
            <button
              className="items-center whitespace-nowrap text-sm font-medium focus:border outline-1 outline-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm h-9 px-4 py-2 flex justify-center gap-2 group rounded-lg w-full border border-white/5 hover:bg-teal-500/20 hover:border-teal-500/30 active:scale-[0.98] transition-all duration-100 ease-in-out"
              disabled
              data-testid="buy-number-button"
            >
              <span className="text-white/80 group-hover:text-white font-bold">
                Add
              </span>
              <svg
                width="20.2832"
                height="19.9316"
                viewBox="0 0 20.2832 19.9316"
                fill="none"
                stroke="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-white/50 group-hover:fill-teal-500 w-[16px] h-[16px]"
              >
                <g>
                  <rect
                    height="19.9316"
                    opacity="0"
                    width="20.2832"
                    x="0"
                    y="0"
                  ></rect>
                  <path
                    d="M19.9219 9.96094C19.9219 15.4004 15.4102 19.9219 9.96094 19.9219C4.52148 19.9219 0 15.4004 0 9.96094C0 4.51172 4.51172 0 9.95117 0C15.4004 0 19.9219 4.51172 19.9219 9.96094ZM9.11133 6.05469L9.11133 9.11133L6.05469 9.11133C5.54688 9.11133 5.19531 9.46289 5.19531 9.9707C5.19531 10.4688 5.54688 10.8008 6.05469 10.8008L9.11133 10.8008L9.11133 13.8672C9.11133 14.3652 9.45312 14.7266 9.95117 14.7266C10.459 14.7266 10.8105 14.375 10.8105 13.8672L10.8105 10.8008L13.877 10.8008C14.375 10.8008 14.7363 10.4688 14.7363 9.9707C14.7363 9.46289 14.375 9.11133 13.877 9.11133L10.8105 9.11133L10.8105 6.05469C10.8105 5.54688 10.459 5.18555 9.95117 5.18555C9.45312 5.18555 9.11133 5.54688 9.11133 6.05469Z"
                    fillOpacity="0.85"
                  ></path>
                </g>
              </svg>
            </button>
            <button
              className="items-center whitespace-nowrap text-sm font-medium focus:border outline-1 outline-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm h-9 px-4 py-2 flex justify-center gap-2 group rounded-lg w-full border border-white/5 hover:bg-teal-500/20 hover:border-teal-500/30 active:scale-[0.98] transition-all duration-100 ease-in-out"
              data-testid="import-number-button"
            >
              <span
                className="text-white/80 group-hover:text-white font-bold"
                onClick={() => setshowdiologbox(true)}
              >
                Import
              </span>
              <svg
                width="23.3887"
                height="25.5957"
                viewBox="0 0 23.3887 25.5957"
                fill="none"
                stroke="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-white/50 group-hover:fill-teal-500 w-[16px] h-[16px]"
              >
                <g>
                  <rect
                    height="25.5957"
                    opacity="0"
                    width="23.3887"
                    x="0"
                    y="0"
                  ></rect>
                  <path
                    d="M19.1016 8.25195L22.4707 12.4316C22.9102 12.959 23.0273 13.3984 23.0273 14.2871L23.0273 20.0684C23.0273 22.0801 22.0117 23.0957 19.9609 23.0957L3.06641 23.0957C1.02539 23.0957 0 22.0801 0 20.0684L0 14.2871C0 13.3984 0.126953 12.959 0.556641 12.4316L3.93555 8.25195C5.07812 6.8457 5.77148 6.02539 7.50977 6.02539L9.23828 6.02539L9.23828 7.40234L7.39258 7.40234C6.67969 7.40234 5.9375 8.02734 5.45898 8.63281L2.00195 12.998C1.62109 13.4668 1.72852 13.6914 2.29492 13.6914L8.30078 13.6914C8.84766 13.6914 9.11133 14.1113 9.11133 14.541L9.11133 14.5801C9.11133 15.7812 10.0488 17.041 11.5137 17.041C12.9883 17.041 13.9258 15.7812 13.9258 14.5801L13.9258 14.541C13.9258 14.1113 14.1797 13.6914 14.7266 13.6914L20.752 13.6914C21.2891 13.6914 21.4258 13.4961 21.0352 12.998L17.5684 8.63281C17.0898 8.02734 16.3477 7.40234 15.6348 7.40234L13.7891 7.40234L13.7891 6.02539L15.5273 6.02539C17.2559 6.02539 17.959 6.8457 19.1016 8.25195Z"
                    fillOpacity="0.85"
                  ></path>
                  <path
                    d="M11.5137 13.5742C11.7188 13.5742 11.8848 13.5156 12.0801 13.3203L15.3809 10.1367C15.5273 9.99023 15.6055 9.82422 15.6055 9.61914C15.6055 9.21875 15.3027 8.93555 14.9023 8.93555C14.707 8.93555 14.502 9.01367 14.3652 9.16992L12.8906 10.7422L12.2266 11.4355L12.2949 9.9707L12.2949 2.24609C12.2949 1.83594 11.9336 1.49414 11.5137 1.49414C11.0938 1.49414 10.7422 1.83594 10.7422 2.24609L10.7422 9.9707L10.8008 11.4355L10.1367 10.7422L8.66211 9.16992C8.51562 9.01367 8.31055 8.93555 8.11523 8.93555C7.71484 8.93555 7.42188 9.21875 7.42188 9.61914C7.42188 9.82422 7.5 9.99023 7.64648 10.1367L10.9473 13.3203C11.1426 13.5156 11.3184 13.5742 11.5137 13.5742Z"
                    fillOpacity="0.85"
                  ></path>
                </g>
              </svg>
            </button>
          </div>
          <p
            className="text-xs px-5 pt-2 text-warning italic"
            data-testid="card-details-warning"
          >
            Please add Card Details to Buy a Number
          </p>
          <div
            role="list"
            data-testid="assistants-list"
            className="flex flex-col w-[320px] p-4 overflow-auto"
          ></div>
        </div>
        <div
          orientation="vertical"
          data-testid="divider"
          className="sc-jTQCzO iaoTAs"
        ></div>
        <div className="flex flex-1 justify-center items-center">
          <div
            className="text-center text-muted-foreground"
            style={{ opacity: 1, transform: "none" }}
          >
            <div className="flex justify-center">
              <svg
                width="26.4355"
                height="26.377"
                viewBox="0 0 26.4355 26.377"
                fill="none"
                stroke="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 w-[100px] h-[100px] fill-white/20"
              >
                <g>
                  <rect
                    height="26.377"
                    opacity="0"
                    width="26.4355"
                    x="0"
                    y="0"
                  ></rect>
                  <path
                    d="M8.58398 5.14648L10.6836 8.10547C11.0156 8.56445 11.1719 8.94531 11.1719 9.29688C11.1719 9.74609 10.9082 10.1367 10.4785 10.5859L9.78516 11.2988C9.67773 11.4062 9.63867 11.5332 9.63867 11.6602C9.63867 11.8066 9.69727 11.9434 9.74609 12.0508C10.0586 12.6562 10.9473 13.6914 11.9043 14.6484C12.8711 15.6055 13.9062 16.4941 14.5117 16.8164C14.6094 16.8652 14.7559 16.9238 14.9023 16.9238C15.0293 16.9238 15.166 16.875 15.2734 16.7676L15.9668 16.084C16.416 15.6445 16.8164 15.3906 17.2559 15.3906C17.6074 15.3906 17.998 15.5469 18.4473 15.8594L21.4453 17.9883C21.9043 18.3203 22.0898 18.7891 22.0898 19.2773C22.0898 19.9414 21.7676 20.6152 21.25 21.1914C20.3613 22.168 19.2578 22.6074 17.998 22.6074C16.3215 22.6074 14.4213 21.8282 12.5612 20.5942C12.5806 20.4247 12.5879 20.2521 12.5879 20.0781C12.5879 16.6309 9.74609 13.7891 6.28906 13.7891C6.13856 13.7891 5.9892 13.7945 5.84288 13.8119C4.6961 12.0257 3.98438 10.2106 3.98438 8.59375C3.98438 7.35352 4.4043 6.23047 5.35156 5.32227C5.92773 4.76562 6.5918 4.47266 7.23633 4.47266C7.76367 4.47266 8.25195 4.67773 8.58398 5.14648Z"
                    fillOpacity="0.85"
                  ></path>
                  <path
                    d="M11.25 20.0781C11.25 22.793 8.98438 25.0391 6.28906 25.0391C3.57422 25.0391 1.32812 22.8125 1.32812 20.0781C1.32812 17.3633 3.57422 15.1172 6.28906 15.1172C9.01367 15.1172 11.25 17.3633 11.25 20.0781ZM5.69336 17.5781L5.69336 19.4824L3.7793 19.4824C3.42773 19.4824 3.18359 19.7168 3.18359 20.0781C3.18359 20.4492 3.42773 20.6836 3.7793 20.6836L5.69336 20.6836L5.69336 22.5879C5.69336 22.9492 5.92773 23.1836 6.28906 23.1836C6.66016 23.1836 6.89453 22.9492 6.89453 22.5879L6.89453 20.6836L8.79883 20.6836C9.16016 20.6836 9.39453 20.4492 9.39453 20.0781C9.39453 19.7168 9.16016 19.4824 8.79883 19.4824L6.89453 19.4824L6.89453 17.5781C6.89453 17.2168 6.66016 16.9727 6.28906 16.9727C5.92773 16.9727 5.69336 17.2168 5.69336 17.5781Z"
                    fillOpacity="0.85"
                  ></path>
                </g>
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-white">
              No Phone Numbers Found
            </h2>
            <p className="text-md text-white/40">
              Add a phone number and connect it to an assistant to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone;
