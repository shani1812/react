import axios, { AxiosError } from "axios";
import { EdgeProfitMarginData, Email, Item, ItemProfit, ItemToAdd, User } from "../types";
import { toast } from "react-toastify";
import { snakeToCamel } from "../utils";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8001/emails",
});

export const getEmailById = async (emailId: String): Promise<Email> => {
    const response = await axiosInstance.get(`/${emailId}`);

    return snakeToCamel(response.data) as Email;
};

export const getSentEmails = async (addresseeId: String): Promise<Email[]> => {
    const response = await axiosInstance.get(`/${addresseeId}/sent`);
    
    return snakeToCamel(response.data) as Email[];
};

export const getInbox = async (addressedId: String | undefined): Promise<Email[]> => {
    const response = await axiosInstance.get(`/${addressedId}/inbox`);
    
    return snakeToCamel(response.data) as Email[];
};

export const readEmail = async (emailId: String): Promise<void> => {
   await axiosInstance.patch(`/${emailId}/read`);
};

export const deleteEmailFromInbox = async (emailId: String): Promise<void> => {
    await axiosInstance.patch(`/${emailId}/delete-from-inbox`);
 };

 export const deleteEmailFromSent = async (emailId: String ): Promise<void> => {
    await axiosInstance.patch(`/${emailId}/delete-from-sent`);
 };

export const createEmail = async (email: Email): Promise<Email> => {
    const response = await axiosInstance.post(`/`, email);
    return snakeToCamel(response.data) as Email;
};



