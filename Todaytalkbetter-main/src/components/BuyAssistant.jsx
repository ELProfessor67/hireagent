import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../constant/URL";
import { debounce } from "lodash";
import Rating from "react-rating"
import { FaStar, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { buyAssistant } from "../http/assistantHttp";
import CallDialoag from "./CallDialoag";

const BuyAssistant = ({ open }) => {
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [search, setSearch] = useState("");
    const [buyLoading, setBuyLoading] = useState(null);
    const [selectedCall, setSelectedCall] = useState(null)

    const handleBuyAssistant = (id) => {
        buyAssistant(id, () => setBuyLoading(id), () => setBuyLoading(null))
    }

    const fetchAssistant = async (page, searchQuery) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${BACKEND_BASE_URL}/api/configs/get-publish-assistant?page=${page}&search=${searchQuery}`
            );
            setAssistants(res.data.data);
            setTotalPage(res.data.totalPage);
        } catch (error) {
            console.log("Error fetching assistant:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Debounced Search Handler
    const debouncedFetch = debounce((page, query) => {
        fetchAssistant(page, query);
    }, 500);

    useEffect(() => {
        debouncedFetch(page, search);
    }, [page, search]);

    return (
        <>

            <div
                className={`${open
                    ? "lg:w-[65%] lg:left-[30%] left-[10rem] w-[60%] sm:left-[15rem] md:w-[70%] sm:w-[62%] xl:w-[75%] xl:left-[23%] xm:w-[68%]"
                    : "lg:w-[89%] lg:left-[10%] w-[70%] left-[25%]"
                    } fixed lg:top-[4.6rem] xl:top-[5rem] bg-black h-[85vh] px-4 py-5 rounded-3xl text-white w-64 top-[6.9rem] sm:top-[4.9rem]`}
            >
                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-500 focus:outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Assistants List */}
                {assistants.length !== 0 && !loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 overflow-y-auto h-[70vh]">
                        {assistants.map((assistant) => (
                            <div
                                key={assistant._id}
                                className="bg-gray-700 rounded-lg p-6 shadow-md relative cursor-pointer hover:shadow-xl transition-shadow duration-300 h-60 overflow-hidden flex flex-col"
                            >
                                <div className="flex-grow overflow-y-auto">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2
                                            className="text-2xl font-semibold"
                                            onClick={() =>
                                                navigate(`/configurationdummyy/${assistant._id}`)
                                            }
                                        >
                                            {assistant.name}
                                        </h2>

                                        <div className="flex items-center gap-2">
                                            {[...Array(5)].map((_, index) => (
                                                <FaStar key={index} className="text-yellow-500 text-lg" />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-muted">
                                        {assistant.description.slice(0, 100)}...
                                    </p>

                                    <div className="flex items-center justify-between my-3">
                                        <h2 className="text-xl flex items-center gap-2"><FaUserAlt/> {assistant.purchaseCount}</h2>
                                        <h2 className="text-2xl">${assistant.price}/m</h2>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2">
                                        <button className="bg-green-500 text-white flex-1 py-2 rounded-md" onClick={() => handleBuyAssistant(assistant._id)} disabled={buyLoading == assistant._id}>{buyLoading == assistant._id ? "Loading..." : "Buy Now"}</button>
                                        <button className="bg-blue-500 text-white flex-1 py-2 rounded-md" onClick={() => setSelectedCall(assistant)}>Try Call</button>
                                        {/* <Link className="bg-blue-500 text-white flex-1 py-2 rounded-md text-center" to={`/assistants/${assistant._id}`}>View</Link> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {assistants.length === 0 && !loading && <h1 className="text-3xl text-center mt-32">No Assistant Found</h1>}
                {loading && <h1 className="text-3xl text-center mt-32">Loading...</h1>}

                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-4 gap-4">
                    <button
                        className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {page} of {totalPage}</span>
                    <button
                        className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                        disabled={page === totalPage}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {
                selectedCall && 
            <CallDialoag assistant={selectedCall} onClose={() => setSelectedCall(null)}/>
            }
        </>
    );
};

export default BuyAssistant;
