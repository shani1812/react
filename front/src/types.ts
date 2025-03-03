import { ReactElement } from "react";

export interface Link {
    label: String;
    path: string;
    icon: ReactElement<any, any>;
}

export interface User {
    id: String;
    name: String;
    emailAddress: String;
    password: String;
}

export interface LoginUser {
    email_address: String;
    password: String;
}

export interface SignupUser {
    name: String;
    email_address: String;
    password: String;
}

export interface Email {
    id: String;
    addressed: User;
    addressee: User;
    title: String;
    text: String;
    date: Date | string;
    isRead: boolean;
    addressedVisible: boolean;
    addresseeVisible: boolean;
}

export interface NewEmail {
    addressed: String;
    addressee: String;
    title: String;
    text: String;
}

export interface inboxEmail {
    addressee: string;
    title: String;
    date: string;
}

export interface sentEmail {
    addressed: string;
    title: String;
    date: string;
}
