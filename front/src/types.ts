import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ChangeEventHandler, ReactElement } from "react";

export interface Link {
    label: String;
    path: string;
    icon: ReactElement<any, any>
    
}

export interface mail {
    addressed: String
    addressee: String
    title: String
    text?: String
    date: Date | String
    isRead: boolean
}


export interface Item {
    _id?: String;
    name: String;
    price: Number;
    stock: Number;
    category: String;
    supplier: Supplier;
    __v?: Number;
    supplierPrice: Number;
    quantity?: Number;
}

export interface DataToAdd {}

export interface ItemToAdd extends DataToAdd {
    _id?: String;
    name: String;
    price: Number;
    stock: Number;
    category: String;
    supplier: String;
    __v?: Number;
    supplierPrice: Number;
    quantity?: Number;
}

export interface SupplierToAdd extends DataToAdd {
    name: String;
}

export interface CartItem {
    _id?: String;
    name: String;
    price: Number;
    stock: Number;
    category: String;
    supplier: Supplier;
    __v?: Number;
}

export interface DetailsData extends Partial<Item> {
    supplierName?: String;
    supplierId?: String;
}

export interface Supplier {
    _id?: String;
    name: String;
}

export interface Category {
    _id?: String;
    name: String;
}

export type Order = {
    _id?: String;
    orderItems: OrderItems[];
    address: Address;
    OrderDate?: Date;
    shopProfit?: Number;
};

export type OrderItems = {
    itemId: String;
    quantity: Number;
};

export interface Address {
    city: String;
    street: String;
    houseNumber: Number;
    entrance?: String | null | undefined;
}

export type AddTextFields = {
    label: String;
    type?: string;
    select?: boolean;
    error: boolean | undefined;
    helperText: String;
    onchange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    sx?: Object;
    supplier?: Supplier[];
};

export type ItemProfit = {
    item: Item;
    profit: Number;
};

export type SupplierProfit = {
    supplier: Supplier;
    profit: Number;
};

export type EdgeProfitMarginData = {
    lowestProfitMargin: Item;
    highestProfitMargin: Item;
};

export interface SupplierSpendingOuput extends Supplier {
    moneySpent: Number;
}

export interface User {
    id: String,
    name: String;
    emailAddress: String;
    password: String;
}

export interface Email {
    id: String,
    addressed: User;
    addressee: User;
    title: String;
    text: String;
    date: Date | string;
    isRead: boolean;
    addressedVisible: boolean
    addresseeVisible: boolean

}


