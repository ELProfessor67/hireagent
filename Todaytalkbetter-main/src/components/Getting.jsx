import React, { useState } from "react";
import SaveCallPopup from "./SaveCallPopup";

const Getting = ({ indiResponse }) => {
  console.log(indiResponse);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSaveClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <div
        className="chakra-card__body bg-muted p-4 h-fit"
        data-testid=""
        style={{ overflowY: "auto" }}
      >
        <div
          className="chakra-stack space-y-4"
          data-testid="session-viewer-right-panel-stack"
        >
          <div data-testid="session-viewer-resume-call" className="space-y-4">
            <div className="opacity-100 flex">
              <button
                type="button"
                className="chakra-button h-auto min-h-10 bg-gray-200 p-4 rounded-md flex items-center space-x-2"
              >
                <div
                  className="chakra-spinner mr-2"
                  aria-hidden="true"
                  focusable="false"
                >
                  <span className="sr-only">Loading...</span>
                </div>
                <div className="chakra-text text-wrap ">Connecting Call...</div>
              </button>
              <div className="chakra-text text-wrap bg-green-500 h-10" onClick={()=>setIsPopupOpen(true)}>
                Save Call
              </div>
            </div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-id">
            <h2 className="chakra-heading text-lg font-bold">ID</h2>
            <div className="chakra-text text-sm">{indiResponse._id}</div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-cost">
            <h2 className="chakra-heading text-lg font-bold">Cost</h2>
            <div className="chakra-text text-sm">
              <b>STT:</b> $0.00 ($Infinity / min)
              <br />
              <b>LLM:</b> $0.00 ($0.00 / min)
              <div>
                - 0 prompt tokens
                <br />- 0 completion tokens
              </div>
              <b>TTS:</b> $0.00 ($0.00 / min)
              <div>- 0 characters</div>
              <b>Vapi:</b> $0.00 ($Infinity / min)
              <b>Transport:</b> $0.00 ($0.00 / min)
              <b>Summary:</b> $0.00 ($0.00 / min)
              <div>
                - 0 prompt tokens
                <br />- 0 completion tokens
              </div>
              <b>Structured Data:</b> $0.00 ($0.00 / min)
              <div>
                - 0 prompt tokens
                <br />- 0 completion tokens
              </div>
              <b>Success Evaluation:</b> $0.00 ($0.00 / min)
              <div>
                - 0 prompt tokens
                <br />- 0 completion tokens
              </div>
              <b>Total:</b> $0.00 ($Infinity / min)
            </div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-ended-reason">
            <h2 className="chakra-heading text-lg font-bold">Ended Reason</h2>
            <div className="chakra-text text-sm">
              {indiResponse.endedReason}
            </div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-metadata">
            <h2 className="chakra-heading text-lg font-bold">Metadata</h2>
            <div className="chakra-text text-sm">{indiResponse.metadata}</div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-assistant">
            <h2 className="chakra-heading text-lg font-bold">Assistant</h2>
            <div className="chakra-text text-sm">{indiResponse.assistant}</div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-user-phone-number">
            <h2 className="chakra-heading text-lg font-bold">
              User Phone Number
            </h2>
            <div className="chakra-text text-sm">
              {indiResponse.phoneNumber}
            </div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-phone-number">
            <h2 className="chakra-heading text-lg font-bold">Phone Number</h2>
            <div className="chakra-text text-sm">
              {indiResponse.phoneNumber}
              - <br />
            </div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-type pb-10">
            <h2 className="chakra-heading text-lg font-bold">Type</h2>
            <div className="chakra-text text-sm">{indiResponse.type}</div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-started-at">
            <h2 className="chakra-heading text-lg font-bold">Started At</h2>
            <div className="chakra-text text-sm">{indiResponse.startedAt}</div>
          </div>
          <div className="chakra-stack__divider border-t border-gray-200"></div>
          <div data-testid="session-viewer-ended-at">
            <h2 className="chakra-heading text-lg font-bold">Ended At</h2>
            <div className="chakra-text text-sm">{indiResponse.endedAt}</div>
          </div>
        </div>
      </div>

      {/* Conditionally render the popup */}
      {isPopupOpen && <SaveCallPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default Getting;
