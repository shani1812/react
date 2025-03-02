import { Box, IconButton, Typography } from "@mui/material";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getEmailById } from "../../axios/emails";
import { getCurrentUser } from "../../axios/users";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Email = () => {
    const GoBackButton = ()=> {
        const navigate = useNavigate();
        const handleGoBack = () => {
            navigate(-1);
        };

        return (
            <IconButton onClick={handleGoBack}>
                <ArrowBackIcon fontSize="large" htmlColor="text.primary" />
            </IconButton>
        );
    }

    const { emailId } = useParams();
    const { data: curr } = useQuery("current-user", getCurrentUser);
    const { data: email, status: status } = useQuery("email", () => getEmailById(emailId!));
    const location = useLocation(); 
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
