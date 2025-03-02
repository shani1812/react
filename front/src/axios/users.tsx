import axios, { AxiosError } from "axios";
import { EdgeProfitMarginData, Item, ItemProfit, ItemToAdd, LoginUser, SignupUser, User } from "../types";
import { toast } from "react-toastify";
import { snakeToCamel } from "../utils";

import { axiosInstance } from "./axiosInstance";

export const getUserById = async (userId: String): Promise<User> => {
    const response = await axiosInstance.get(`/users/${userId}`);

    return snakeToCamel(response.data) as User;
};

export const getUserByEmailAddress = async (emailAddress: String, gtr: String): Promise<User> => {
    const response = await axiosInstance.get(`/users/email-address/${emailAddress}`);
    return snakeToCamel(response.data) as User;
};



export const getCurrentUser = async (bgs: String): Promise<User> => {
    console.log("from " + bgs);
    
    const response = await axiosInstance.get(`/users/email-address/user1@gmail.com`);
    return snakeToCamel(response.data) as User;
};


