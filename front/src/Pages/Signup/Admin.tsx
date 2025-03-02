import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {checkEmailAvailability, createUser} from "../../axios/auth"; 
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useQuery, useMutation } from "react-query";




const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");

    // Use React Query to check email availability
    const { data: emailAvailable, isLoading: emailLoading, isError, error: emailCheckError } = useQuery(
        ["checkEmail", email],
        () => checkEmailAvailability(email),
        {
            enabled: email.length > 0, // Only run the query when email is not empty
            refetchOnWindowFocus: false,
        }
    );

    // Use Mutation for handling Signup
    const { mutate: signup, isLoading: signupLoading } = useMutation(createUser, {
        onSuccess: () => {
            navigate("/login"); // Redirect to login page after successful signup
        },
        onError: (err: any) => {
            setError("Signup failed. Please try again.");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate Name
        if (!isValidName(name)) {
            setError("Name must be at least 2 characters long and only contain letters.");
            return;
        }

        // Validate Email
        if (!isValidEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Check if email is available
        if (emailLoading) {
            setError("Checking email availability...");
            return;
        }

        if (isError || emailAvailable === false) {
            setEmailError("Email is already taken or there was an error.");
            return;
        }

        // Submit Signup if all validation passes
        signup({ name: name, emailAddress: email, password: password });
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const isValidName = (name: string) => {
        const nameRegex = /^[A-Za-z]{2,}$/; // Only letters, at least 2 characters
        return nameRegex.test(name);
    };

    return (
        <Container>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",justifyContent: "center", height: "100vh", padding: 2 }}>
                <Typography variant="h3" gutterBottom>Sign Up to Email</Typography>
                {error && <Typography color="error" variant="body2">{error}</Typography>}
                {emailError && <Typography color="error" variant="body2">{emailError}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        type="text"
                        fullWidth
                        required
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailLoading ? (
                        <Typography variant="body2">Checking email availability...</Typography>
                    ) : (
                        emailAvailable === false && (
                            <Typography variant="body2" color="error">
                                This email is already taken.
                            </Typography>
                        )
                    )}
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        required
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={signupLoading}>
                        {signupLoading ? "Signing up..." : "Sign Up"}
                    </Button>
                </form>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        Already have an account? <a href={`/login${location.search}`}>Log In</a>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default Signup;
