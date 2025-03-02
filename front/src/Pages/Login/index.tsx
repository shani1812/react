import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { login } from "../../axios/auth";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useMutation } from "react-query";


const Login = () => {
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { mutate, isLoading, isError } = useMutation(login, {
        onError: () => {
            setError("Wrong email or password");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const relayState = location.search;  // This will pass the query parameters if needed
        mutate({ user: { email_address: email, password: password }, relayState });
    };
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 2, height: "100vh" }}>
            <Typography variant="h3" gutterBottom>Log in to Email</Typography>
            {isError && <Typography color="error" variant="body2">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </Button>
            </form>
            <Box sx={{ mt: 2 }}>
                <Typography>
                    Don't have an account? <a href={`/signup${location.search}`}>Sign Up</a>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
