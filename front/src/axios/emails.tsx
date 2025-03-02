import { Email, NewEmail } from "../types";
import { snakeToCamel } from "../utils";
import { axiosInstance } from "./axiosInstance";

export const getEmailById = async (emailId: String): Promise<Email> => {
    const response = await axiosInstance.get(`/emails/${emailId}`);

    return snakeToCamel(response.data) as Email;
};

export const getSentEmails = async (addresseeId: String): Promise<Email[]> => {
    const response = await axiosInstance.get(`/emails/${addresseeId}/sent`);

    return snakeToCamel(response.data) as Email[];
};

export const getInbox = async (addressedId: String | undefined): Promise<Email[]> => {
    const response = await axiosInstance.get(`/emails/${addressedId}/inbox`);

    return snakeToCamel(response.data) as Email[];
};

export const readEmail = async (emailId: String): Promise<void> => {
    await axiosInstance.patch(`/emails/${emailId}/read`);
};

export const deleteEmailFromInbox = async (emailId: String): Promise<void> => {
    await axiosInstance.patch(`/emails/${emailId}/delete-from-inbox`);
};

export const deleteEmailFromSent = async (emailId: String): Promise<void> => {
    await axiosInstance.patch(`/emails/${emailId}/delete-from-sent`);
};

export const createEmail = async (email: NewEmail): Promise<Email> => {
    const response = await axiosInstance.post(`/emails/`, email);
    return snakeToCamel(response.data) as Email;
};
