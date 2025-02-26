import axios, { AxiosError } from "axios";
import { EdgeProfitMarginData, Item, ItemProfit, ItemToAdd } from "../types";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
});

export const getItems = async (): Promise<String> => {
    const response = await axiosInstance.get("/");

    return response.data;
};


