import axios from "axios";
import { loginRedirect } from "./loginRedirect";

const API_URL =  import.meta.env.REACT_APP_API_URL || "http://localhost:8000";

export const axiosInstance = axios.create({
    baseURL:  `${API_URL}/api`,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.status === 401) {
            loginRedirect();
        } else {
            throw error;
        }
    }
);
