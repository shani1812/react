import axios from "axios";
import { Order } from "../types";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/orders",
});

export const createOrder = async (order: Order | null): Promise<Order | null> => {
    if (order !== null) {
        const createdOrder = await axiosInstance.post(`/create`, order);
        if (createdOrder.status === 201) {
            toast.success("thank you for ordering");
        } else {
            toast.error("something went wrong- order was not made");
        }
        return createdOrder.data;
    }
    return null;
};

export const getMonthlyRevenues = async (): Promise<String> => {
    return (await axiosInstance.get("/revenues/monthly")).data;
};

export const getWeeklyMostProfitableCategory = async (): Promise<String> => {
    return (await axiosInstance.get("/most-profitable-category/weekly")).data;
};
