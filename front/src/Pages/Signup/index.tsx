import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { checkEmailAvailability, createUser } from "../../axios/auth"; 
import { TextField, Button, Typography, Box } from "@mui/material";
import { useQuery, useMutation } from "react-query";

const Signup = () => {
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [submit, setSubmit] = useState(false);

    const { data: emailAvailable } = useQuery(
        ["checkEmail", formData.email],
        () => checkEmailAvailability(formData.email),
        {
            enabled: submit, 
        }
    );

    
    const { mutate: signup, isLoading: signupLoading } = useMutation(createUser, {
        onError: (_err: any) => {
            setErrors((prevErrors) => ({
                ...prevErrors,
                general: "Signup failed. Please try again."
            }));
        }
    });


    const validateForm = () => {
        let formErrors = { name: "", email: "", password: "" };

        const nameRegex = /^[A-Za-z]{2,}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!nameRegex.test(formData.name)) {
            formErrors.name = "Name must be at least 2 characters long and only contain letters.";
        }

      
        if (!emailRegex.test(formData.email)) {
            formErrors.email = "Please enter a valid email address.";
        }

       
        if (emailAvailable === "False") {
            formErrors.email = "Email is already taken.";
        }

        
        if (formData.password.length < 6) {
            formErrors.password = "Password must be at least 6 characters long.";
        }

        setErrors(formErrors);

        return !Object.values(formErrors).some((error) => error !== "");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmit(true); 
    };

    useEffect(()=> {
        if (submit && validateForm()) {
            signup({
                user: {email_address: formData.email, ...formData},
                relayState: location.search,
            });
        }
    },[emailAvailable, formData])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const fields = [
        {
            name: "name",
            label: "Name",
            type: "text",
            error: errors.name,
            value: formData.name
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            error: errors.email,
            value: formData.email
        },
        {
            name: "password",
            label: "Password",
            type: "password",
            error: errors.password,
            value: formData.password
        }
    ];

    return (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", padding: 2 }}>
                <Typography variant="h3" gutterBottom>Sign Up to Email</Typography>

                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <TextField
                            key={field.name}
                            label={field.label}
                            type={field.type}
                            name={field.name}
                            fullWidth
                            required
                            margin="normal"
                            value={field.value}
                            onChange={handleChange}
                            error={!!field.error} 
                            helperText={field.error}
                        />
                    ))}

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
    );
};

export default Signup;
