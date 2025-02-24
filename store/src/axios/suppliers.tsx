import axios from "axios";
import { Supplier, SupplierProfit, SupplierSpendingOuput } from "../types";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/suppliers",
});

export const getSupplierById = async (id: String): Promise<Supplier | null> => {
    const response = await axiosInstance.get(`/${id}`);

    return response.data;
};

export const getSuppliers = async (): Promise<Supplier[]> => {
    const response = await axiosInstance.get(`/`);

    return response.data;
};

export const deleteSupplier = async (supplierId: String, refetch: Function, refetchItems: Function): Promise<void> => {
    const deletion = await axiosInstance.delete(`/${supplierId}/delete`);
    if (deletion.status === 200) {
        toast.info("supplier deleted successfully");
    } else {
        toast.error("something went wrong. deletion was not proccessed");
    }
    refetch();
    refetchItems();
};

export const addSupplier = async (supplier: Supplier, refetch: Function): Promise<void> => {
    const created = await axiosInstance.post(`/create`, supplier);
    if (created.status === 201) {
        toast.info("supplier created successfully");
        refetch();
    } else {
        toast.error("something went wrong. creation was not proccessed");
    }
};

export const getMostProfitableSupplier = async (): Promise<SupplierProfit> => {
    const response = await axiosInstance.get(`/most-profitable`);

    return response.data;
};

export const getSuppliersExpenses = async (): Promise<SupplierSpendingOuput[]> => {
    const response = await axiosInstance.get(`/expenses`);

    return response.data;
};
