import { User } from "../types";
import { snakeToCamel } from "../utils";
import { axiosInstance } from "./axiosInstance";

export const getUserById = async (userId: String): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}`);

    return snakeToCamel(response.data) as User;
};

export const getUserByEmailAddress = async (emailAddress: String): Promise<User> => {
    const response = await axiosInstance.get(`/users/email-address/${emailAddress}`);
    return snakeToCamel(response.data) as User;
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await axiosInstance.get(`/users/current`);
    return response.data;
};
