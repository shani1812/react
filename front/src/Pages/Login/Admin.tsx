import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {login} from "../../axios/auth"; // Adjust the import to match your setup
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useMutation } from "react-query";


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Use `useMutation` for handling POST requests
    const { mutate, isLoading, isError } = useMutation(login, {
        onSuccess: (data) => {
            // On success, store the token or handle post-login logic
            console.log("Login successful:", data);
        },
        onError: (err: any) => {
            // Handle error from login
            setError("Invalid email or password.");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ email_address: email, password: password }); // Trigger the mutation (POST request)
    };

   const location = useLocation()
   console.log(location)

    return (
        
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: "center", padding: 2, height: "100vh" }}>
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
