import axios from "axios";
import { LoginUser, SignupUser, User } from "../types";
import { snakeToCamel } from "../utils";
import { SignJWT, JWTPayload } from "jose";

const SECRET_KEY = "secret_key";

const generateJWT = async (payload: Record<string, any>): Promise<string> => {
    const secret = new TextEncoder().encode(SECRET_KEY);
    return await new SignJWT(payload as JWTPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);
};

const handleAuthentication = async (user: User, relayState: string) => {
    const payload: Record<string, any> = {
        id: user.id,
        name: user.name,
        email_address: user.emailAddress,
    };

    const jwtToken = await generateJWT(payload);
    window.location.href = `http://localhost:8000/auth/callback${relayState ? relayState : "?relayState=/"}&jwt=${jwtToken}`;
};

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/auth",
});

export const createUser = async ({ user, relayState }: { user: SignupUser; relayState: string }): Promise<User> => {
    const response = await axiosInstance.post(`/signup`, user);
    await handleAuthentication(snakeToCamel(response.data) as User, relayState);
    return response.data;
};

export const login = async ({ user, relayState }: { user: LoginUser; relayState: string }): Promise<User> => {
    const response = await axiosInstance.post(`/login`, user);
    await handleAuthentication(snakeToCamel(response.data) as User, relayState);
    return response.data;
};

export const checkEmailAvailability = async (email: string): Promise<string> => {
    const response = await axiosInstance.get(`/${email}/availability`);
    console.log(response.data.available);

    return response.data.available;
};
