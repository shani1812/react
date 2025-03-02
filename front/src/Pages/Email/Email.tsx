import { Box, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import "../Admin/styles.css";

import { useParams } from "react-router-dom";
import { getEmailById, readEmail } from "../../axios/emails";
import { getCurrentUser } from "../../axios/users";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return <div id={`simple-tabpanel-${index}`}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

const Email = () => {
    function GoBackButton() {
        const navigate = useNavigate();

        const handleGoBack = () => {
            navigate(-1); // This will go back to the previous page in the browser history
        };

        return (
            <IconButton onClick={handleGoBack}>
                <ArrowBackIcon fontSize="large" htmlColor="text.primary" />
            </IconButton>
        );
    }

    const { emailId } = useParams();

    const itemTitles: Record<string, String> = {
        _id: "ID",
        name: "Name",
        price: "Price",
        stock: "Stock",
        category: "Category",
        supplier: "Supplier's Name",
        supplierPrice: "Supplier's price",
    };

    const { data: curr } = useQuery("items", ()=>getCurrentUser("email"));
    const { data: email, status: status } = useQuery("email", () => getEmailById(emailId!));
    const { mutate: readEmailMutation } = useMutation(readEmail);

    const location = useLocation(); // Get the current URL location
    // Check if the URL contains 'sent'
    const isSent = location.pathname.includes("sent");


    return (
        <>
            <Box sx={{ width: "85vw", height: "90vh", padding: "0 4%" }} className="page-content">
                <Box sx={{ minHeight: "90vh",overflow: "auto", padding: "0 2%" }} border={"2px inset"}>
                    <GoBackButton />
                    {status === "success" &&
                    ((email.addressee.id === curr?.id && isSent) || (email.addressed.id === curr?.id && !isSent)) ? (
                        <>
                            <div style={{ marginBottom: "5%" }}>
                                <Typography variant="h2">{email.title}</Typography>
                                <Typography display={"inline"} variant="h4">
                                    {isSent
                                        ? `to: ${email.addressed.id === curr?.id ? "You" : email.addressed.name} `
                                        : `from: ${email.addressee.id === curr?.id ? "You" : email.addressee.name} `}
                                </Typography>
                                <Typography display={"inline"} variant="h5">
                                    ({isSent ? email.addressed.emailAddress : email.addressee.emailAddress})
                                </Typography>
                                <Typography marginTop={1}>{new Date(email.date).toLocaleString()}</Typography>
                            </div>

                            <Typography>{email.text}</Typography>
                        </>
                    ) : status === "loading" ? (
                        <Typography variant="h2">loading...</Typography>
                    ) : status === "error" ? (
                        <Typography variant="h2">email not found</Typography>
                    ) : (
                        <Typography variant="h2">email not found</Typography>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default Email;
