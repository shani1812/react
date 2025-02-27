import axios, { AxiosError } from "axios";
import { EdgeProfitMarginData, Item, ItemProfit, ItemToAdd, User } from "../types";
import { toast } from "react-toastify";
import { snakeToCamel } from "../utils";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8001/users",
});

export const getUserById = async (userId: String): Promise<User> => {
    const response = await axiosInstance.get(`/${userId}`);

    return snakeToCamel(response.data) as User;
};

export const getUserByEmailAddress = async (emailAddress: String): Promise<User> => {
    const response = await axiosInstance.get(`/email-address/${emailAddress}`);
    return snakeToCamel(response.data) as User;
};

export const createUser = async (user: User): Promise<User> => {
    const response = await axiosInstance.post(`/`, user);
    return snakeToCamel(response.data) as User;
};


export const getCurrentUser = async (): Promise<User> => {
    const response = await axiosInstance.get(`/email-address/user1@gmail.com`);
    return snakeToCamel(response.data) as User;
};