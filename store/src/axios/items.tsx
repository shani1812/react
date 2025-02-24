import axios, { AxiosError } from "axios";
import { EdgeProfitMarginData, Item, ItemProfit, ItemToAdd } from "../types";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/items",
});

export const getItems = async (): Promise<Item[]> => {
    const response = await axiosInstance.get("/");

    return response.data;
};

export const getItemById = async (id: String): Promise<Item> => {
    const response = await axiosInstance.get(`/${id}`);

    return response.data;
};

export const getRecommendations = async (cartItems: Item[]): Promise<Item[]> => {
    const ids = cartItems.length ? cartItems.map((item) => item._id) : [];
    const response = await axiosInstance.post("/recommendations", ids);

    return response.data;
};

export const deleteItem = async (itemId: String, refetch: Function): Promise<void> => {
    const deletion = await axiosInstance.delete(`/${itemId}/delete`);
    if (deletion.status === 200) {
        toast.info("item deleted successfully");
    } else {
        toast.error("something went wrong. deletion was not proccessed");
    }
    refetch();
};

export const updateItem = async (updatedItem: Item | null, refetch: Function): Promise<void> => {
    const id = updatedItem!._id;
    delete updatedItem!._id;
    delete updatedItem?.__v;

    const update = await axiosInstance.put(`/${id}/update`, { ...updatedItem, supplier: updatedItem?.supplier._id });
    if (update.status === 200) {
        toast.info("item updated successfully");
    } else {
        toast.error("something went wrong. update was not proccessed");
    }

    refetch();
};

export const addItem = async (item: ItemToAdd, refetch: Function): Promise<void> => {
    try {
        await axiosInstance.post(`/create`, item);
        toast.info("item created successfully");
        refetch();
    } catch (e) {
        const err = e as AxiosError;
        const errMsg = String(err.response!.data);
        toast.error(
            errMsg.includes("E11000")
                ? `there is already an item named ${item.name} from that supplier`
                : "something went wrong. creation was not proccessed"
        );
    }
};

export const getDailyMostProfitableItem = async (): Promise<ItemProfit> => {
    const response = await axiosInstance.get(`/most-profitable/daily`);

    return response.data;
};

export const getEdgeProfitMarginItems = async (): Promise<EdgeProfitMarginData> => {
    const response = await axiosInstance.get(`/profit-margin/edge`);

    return response.data;
};
