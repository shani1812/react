import axios from "axios";
import { loginRedirect } from "./loginRedirect";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
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