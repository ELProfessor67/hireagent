import React, { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { IoCopy } from "react-icons/io5";
import { MdDone } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const Provider = ({ open }) => {
  const userDetails = JSON.parse(localStorage.getItem("UserDetails"));
  const [isPublic, setIsPublic] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [privateKey, setPrivateKey] = useState("reyuegrcyegryu7834g3ygf38f34");
  const [publicKey, setPublicKey] = useState("oifrgheufghuegueu3g49347t473h3");
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const togglePrivate = () => {
    setIsPublic(false);
    setIsPrivate(true);
  };

  const togglePublic = () => {
    setIsPrivate(false);
    setIsPublic(true);
  };

  const togglePublicKeyVisibility = () => {
    setShowPublicKey(!showPublicKey);
  };

  const togglePrivateKeyVisibility = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  return (
    <div
      className={`${
        open
          ? "lg:w-[65%]  lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[79%] xl:left-[20%] xm:w-[68%]"
          : "lg:w-[93%] lg:right-[3%] lg:left-[6%] w-[70%] left-[25%]"
      } absolute   flex-col gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white p-5 sm:top-[4.9rem] top-[6.9rem]  overflow-hidden`}
    >
      <div className="flex gap-2 items-center pb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
        <h4 className="text-lg ">{userDetails?.email}'s Org</h4>
      </div>
      <hr className="mb-3" />
      <div className="bg-gray-900 text-white rounded-lg max-w-md">
        <div className="px-6 pt-3 flex justify-between">
          <div>
            <h1 className="text-xl font-semibold mb-4">API Keys</h1>
            <h1 className="text-base text-gray-400 font-semibold mb-4">
              All your API Keys
            </h1>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-gray-500 cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <hr className="mb-1" />
        <div className="px-6 py-4">
          <div className="flex mb-4 w-60">
            <button
              className={`${
                isPrivate ? "bg-[#5D5FEF]" : "bg-gray-700"
              } flex-1 py-2 rounded-l-lg`}
              onClick={togglePrivate}
            >
              Private
            </button>
            <button
              className={`${
                isPublic ? "bg-[#5D5FEF]" : "bg-gray-700"
              } flex-1 py-2 rounded-r-lg`}
              onClick={togglePublic}
            >
              Public
            </button>
          </div>
          {isPrivate ? (
            <div className="bg-gray-950 p-4 rounded-lg">
              <h2 className="text-xl font-medium mb-2">Private Key</h2>
              <p className="text-gray-400 mb-2">
                Use your Private API Keys if you want to interact with our APIs
                via your Backend Systems.
              </p>
              <div className="relative bg-gray-900 rounded-lg p-3">
                <h2 className="text-lg font-medium mb-2">Private Key</h2>
                <div className="bg-gray-900 border border-white flex justify-center items-center rounded-lg px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    readOnly
                    value={
                      showPrivateKey ? privateKey : "************************"
                    }
                    className="bg-gray-900 w-full py-2 pl-1 pr-10 rounded-lg text-gray-300"
                  />
                  <div className="absolute inset-y-0 top-8 right-0 flex items-center pr-5 space-x-2">
                    {showPrivateKey ? (
                      <IoMdEyeOff
                        className="cursor-pointer"
                        onClick={togglePrivateKeyVisibility}
                      />
                    ) : (
                      <IoEye
                        className="cursor-pointer"
                        onClick={togglePrivateKeyVisibility}
                      />
                    )}
                    <IoCopy className="cursor-pointer" />
                    <MdDelete className="cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-950 p-4 rounded-lg">
              <h2 className="text-xl font-medium mb-2">Public Key</h2>
              <p className="text-gray-400 mb-2">
                Use your Public API Keys if you want to interact with our Client
                SDKs.
              </p>
              <div className="relative bg-gray-900 rounded-lg p-3">
                <h2 className="text-lg font-medium mb-2">Public Key</h2>
                <div className="bg-gray-900 border border-white flex justify-center items-center rounded-lg px-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="text"
                    readOnly
                    value={
                      showPublicKey ? publicKey : "************************"
                    }
                    className="bg-gray-900 w-full py-2 pl-1 pr-10 rounded-lg text-gray-300"
                  />
                  <div className="absolute flex right-4 bg-gray-900 gap-2">
                    {showPublicKey ? (
                      <IoMdEyeOff
                        className="cursor-pointer"
                        onClick={togglePublicKeyVisibility}
                      />
                    ) : (
                      <IoEye
                        className="cursor-pointer"
                        onClick={togglePublicKeyVisibility}
                      />
                    )}
                    <IoCopy className="cursor-pointer" />
                    <MdDelete className="cursor-pointer" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3>
                    <span>Origins:</span> All domains allowed
                  </h3>
                  <h3>
                    <span>Assistants:</span> All Assistants allowed
                  </h3>
                  <h3>
                    <span>Transient Assistants:</span> Allowed
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Provider;
