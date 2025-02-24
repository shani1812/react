import axios from "axios";
import { Category } from "../types";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/categories",
});

export const getCategories = async (): Promise<Category[]> => {
    const response = await axiosInstance.get(`/`);

    return response.data;
};
