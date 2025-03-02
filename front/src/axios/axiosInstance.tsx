import axios, { AxiosError } from "axios";
import { loginRedirect } from "./loginRedirect";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.log(error.status);
        if (error.status === 401) {
            console.log("in");
            loginRedirect();
        } else {
            throw error;
        }
    }
);
