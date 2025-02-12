import axios from "axios";
import React, { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from '../constant/URL'

const Documents = ({ open }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedFileInfo, setSelectedFileInfo] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${BACKEND_BASE_URL}/api/doc/deleteDoc/${id}`
      );
      // Remove the deleted document from the state
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (error) {
      console.log("Error deleting document:", error);
    }
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/doc/getAllDocList`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDocuments(data.documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Extract file information
    const fileInfo = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file.type,
      webkitRelativePath: file.webkitRelativePath,
    };
    // console.log(fileInfo);
    // Update state with file information
    setSelectedFile(file);
    setSelectedFileInfo(fileInfo);
    setShowConfirmation(true);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected.");
      return;
    }

    setShowConfirmation(false);

    try {
      console.log( { document: { ...selectedFileInfo }, userId: "harsh" })
      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/doc/uploadDoc`,
        { document: { ...selectedFileInfo }, userId: "harsh" },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDocuments([...documents, response.data.document]);
    } catch (error) {
      console.error("Error uploading document:", error);
    }
  };

  return (
    <div
      className={`${
        open
          ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
          : "lg:w-[89%] lg:left-[10%] w-[70%] left-[25%]"
      } fixed gap-[24px] lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] rounded-3xl text-white w-64 top-[6.9rem] sm:top-[4.9rem]`}
    >
      <div className="flex h-full w-full justify-between gap-10">
        <div className="w-1/3 m-10">
          <div className="space-y-2">
            <div
              role="presentation"
              tabIndex="0"
              className="dropzone group relative border-dashed border-[3px] min-h-20 flex flex-col items-center justify-center text-wrap mx-auto rounded-xl p-4 cursor-pointer active:scale-[0.98] transition-all duration-150 ease-in-out bg-black/10 border-white/10 hover:border-white/20"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                type="file"
                id="fileInput"
                name="file"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <svg
                width="23.3887"
                height="27.666"
                viewBox="0 0 23.3887 27.666"
                fill="none"
                stroke="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-12 h-12 mb-2 fill-white/30 group-hover:fill-white/40"
              >
                <g>
                  <rect
                    height="27.666"
                    opacity="0"
                    width="23.3887"
                    x="0"
                    y="0"
                  ></rect>
                  <path
                    d="M19.1992 9.6582L22.4707 13.8574C22.9102 14.4043 23.0273 14.8242 23.0273 15.7129L23.0273 21.1035C23.0273 23.1152 22.0117 24.1309 19.9609 24.1309L3.06641 24.1309C1.02539 24.1309 0 23.1152 0 21.1035L0 15.7129C0 14.8242 0.126953 14.4043 0.556641 13.8574L3.81836 9.6875C5.0293 8.14453 5.47852 7.8418 7.2168 7.8418L9.23828 7.8418L9.23828 9.21875L7.09961 9.21875C6.38672 9.21875 5.91797 9.3457 5.35156 10.0781L2.00195 14.4238C1.64062 14.8828 1.72852 15.1172 2.29492 15.1172L8.30078 15.1172C8.84766 15.1172 9.11133 15.5371 9.11133 15.9668L9.11133 16.0059C9.11133 17.207 10.0488 18.4668 11.5137 18.4668C12.9883 18.4668 13.9258 17.207 13.9258 16.0059L13.9258 15.9668C13.9258 15.5371 14.1797 15.1172 14.7266 15.1172L20.752 15.1172C21.2891 15.1172 21.416 14.9219 21.0352 14.4238L17.6562 10.0488C17.1094 9.33594 16.6406 9.21875 15.9277 9.21875L13.7891 9.21875L13.7891 7.8418L15.8105 7.8418C17.5488 7.8418 18.0176 8.14453 19.1992 9.6582Z"
                    fillOpacity="0.85"
                  ></path>
                  <path
                    d="M11.5137 15.8887C11.9336 15.8887 12.2949 15.5371 12.2949 15.127L12.2949 5.09766L12.2266 3.64258L12.8906 4.32617L14.3652 5.9082C14.502 6.06445 14.707 6.14258 14.9023 6.14258C15.3027 6.14258 15.6055 5.84961 15.6055 5.45898C15.6055 5.24414 15.5273 5.08789 15.3809 4.94141L12.0801 1.75781C11.8848 1.5625 11.7188 1.49414 11.5137 1.49414C11.3184 1.49414 11.1426 1.5625 10.9473 1.75781L7.64648 4.94141C7.5 5.08789 7.42188 5.24414 7.42188 5.45898C7.42188 5.84961 7.71484 6.14258 8.11523 6.14258C8.31055 6.14258 8.51562 6.06445 8.66211 5.9082L10.1367 4.32617L10.8008 3.63281L10.7422 5.09766L10.7422 15.127C10.7422 15.5371 11.0938 15.8887 11.5137 15.8887Z"
                    fillOpacity="0.85"
                  ></path>
                </g>
              </svg>
              <p className="text-sm text-white/30 font-semibold text-center">
                Drag 'n' drop a file here, or click to select file locally
              </p>
            </div>

            <button
              className="items-center whitespace-nowrap focus:border outline-1 outline-ring focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 shadow py-2 group flex px-1 w-full h-10 justify-center text-sm font-bold text-white rounded-lg border bg-primary/30 border-white/5 hover:bg-primary/40 hover:text-white/70 transition-all duration-150 ease-in-out"
              type="button"
            >
              <span>Submit</span>
              <svg
                width="20.2832"
                height="19.9316"
                viewBox="0 0 20.2832 19.9316"
                fill="none"
                stroke="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 ml-2 fill-white/30 group-hover:fill-white/40"
              >
                <g>
                  <path
                    d="M0 9.81055C0 15.2715 4.54492 19.9316 10.2832 19.9316C15.7227 19.9316 20.2832 15.293 20.2832 9.81055C20.2832 4.54492 15.7227 0 10.2832 0C4.54492 0 0 4.66016 0 9.81055ZM8.33008 5.44922C8.33008 4.96191 8.69727 4.59473 9.18457 4.59473C9.58105 4.59473 9.8418 4.78906 10.1377 5.08496L14.4668 9.41406C14.6924 9.63965 14.8486 9.89258 14.8486 10.2637C14.8486 10.6787 14.4639 11.0391 14.0234 11.0391C13.6621 11.0391 13.4092 10.8838 13.1836 10.6582L11.2529 8.62207L10.2832 7.58105L10.3125 15.1582C10.3125 15.624 9.95703 15.9297 9.44727 15.9297C8.92676 15.9297 8.56445 15.6445 8.56445 15.1582L8.53516 7.58105L7.55469 8.62207L5.61914 10.6582C5.39355 10.8838 5.14062 11.0391 4.7793 11.0391C4.33887 11.0391 3.9541 10.6787 3.9541 10.2637C3.9541 9.89258 4.11035 9.63965 4.33594 9.41406L8.66504 5.08496C8.93164 4.78906 9.20117 4.59473 9.58789 4.59473C10.0752 4.59473 10.4375 4.96191 10.4375 5.44922Z"
                    fillOpacity="0.85"
                  ></path>
                </g>
              </svg>
            </button>
            {showConfirmation && (
              <div className="fixed ...">
                <p>Confirm upload?</p>
                <button
                  onClick={handleConfirmUpload}
                  className="bg-white text-black px-3 py-1"
                >
                  Confirm
                </button>
                <button onClick={() => setShowConfirmation(false)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full ">
          <div className="mt-3 ml-2">
            <h4 className="text-sm font-semibold text-white mb-5">
              Uploaded documents
            </h4>
          </div>
          <div
            className="grid grid-cols-1  gap-7 text-white cursor-pointer w-full"
            data-testid="uploaded-documents-list"
          >
            {loading ? (
              <p>Loading documents...</p>
            ) : error || documents.length === 0 ? (
              <p>No documents found</p>
            ) : (
              documents.map((document) => (
                <div className="flex w-full gap-10" key={document._id}>
                  <div className="flex flex-col w-full">
                    <div className="w-full min-h-32 bg-yellow-300 rounded-md flex justify-center items-center">
                      {document.fileName}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p>{document.fileName}</p>
                      <p>
                        {document.metaData} - {document.fileSize}B
                      </p>
                      <div className="flex gap-5">
                        <a
                          href={document.fileUrl}
                          className="bg-gray-500 text-white px-5 py-1 text-xs"
                          download={document.fileName} // Added download attribute
                        >
                          Download
                        </a>
                        <button
                          className="bg-gray-500 text-white px-5 py-1 text-xs"
                          onClick={() =>
                            navigator.clipboard.writeText(document.fileUrl)
                          }
                        >
                          Copy URL
                        </button>
                        <button
                          className="bg-red-500 text-white px-5 py-1 text-xs"
                          onClick={() => handleDelete(document._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full text-sm">
                    <p>Id</p>
                    <span>{document._id}</span>
                    <p>Metadata</p>
                    <div className="flex flex-col gap-2 mt-6">
                      <p>Created At:</p>
                      <p>{new Date(document.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
