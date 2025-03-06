import axios from "axios";
import { BACKEND_BASE_URL } from "../constant/URL";

export const buyAssistant = async (id, startLoading, stopLoading) => {
    startLoading();
    try {
        const token = localStorage.getItem("Token");
        if (!token) {
            console.error("No token found");
            return;
        }
        const res = await axios.post(
            `${BACKEND_BASE_URL}/api/configs/buy-assistant`,
            {
                id
            },
            {
                headers: {
                    Authorization: token,
                },
            }
        );
        alert(res.data.message);
    } catch (error) {

    } finally {
        stopLoading();
    }
}