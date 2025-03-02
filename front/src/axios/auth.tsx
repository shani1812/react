import axios from "axios";
import { LoginUser, SignupUser, User } from "../types";
import { snakeToCamel } from "../utils";
import { SignJWT, JWTPayload } from "jose";
import { useLocation } from "react-router-dom";

const SECRET_KEY = "your-secret-key"; // Replace with a secure key in production

const generateJWT = async (payload: Record<string, any>): Promise<string> => {
    const secret = new TextEncoder().encode(SECRET_KEY);
    return await new SignJWT(payload as JWTPayload) // Explicitly casting payload
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(secret);
};

const handleAuthentication = async (user: User) => {
    const payload: Record<string, any> = {
        userId: user.id,
        name: user.name,
        emailAddress: user.emailAddress,
        // Removed password for security reasons
    };

    const jwtToken = await generateJWT(payload);
    const callbackUrl = `http://localhost:8000/callback?jwt=${jwtToken}${useLocation().search}`;

    // Redirect user to backend's auth callback
    window.location.href = callbackUrl;
};

// Axios instance with base URL
export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/users",
});

// Create user (Sign-up)
export const createUser = async (user: SignupUser): Promise<void> => {
    const response = await axiosInstance.post(`/`, user);
    await handleAuthentication(snakeToCamel(response.data) as User);
};

// Login user
export const login = async (user: LoginUser): Promise<void> => {
    const response = await axiosInstance.post(`/login`, user);
    await handleAuthentication(snakeToCamel(response.data) as User);
};

// Check email availability
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
    const response = await axiosInstance.get(`/check-email?email=${email}`);
    return response.data.available;
};
