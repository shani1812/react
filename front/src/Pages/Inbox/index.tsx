import { Box } from "@mui/material";
import { useQuery } from "react-query";
import TableData from "../../Components/EmailsTable";
import { getInbox } from "../../axios/emails";
import { Email, User } from "../../types";
import { getCurrentUser } from "../../axios/users";

const Inbox = () => {
    const { data: emails, status: emailsStatus, refetch } = useQuery("inbox", getInbox);

    const { data: curr } = useQuery("current-user", getCurrentUser);

    const manipulateData = (email: Email) => {
        const { isRead, id, text, addressedVisible, addresseeVisible, addressed, ...newEmail } = email;

        return Object.entries(newEmail).map(([k, v]) => {
            switch(k){
                case "addressee":
                    return `from: ${(v as User).id === curr?.id ? "you" : (v as User).emailAddress}`
                case "title":
                    return `topic: "${v}"`
                case "date":
                    return new Date(v as Date).toLocaleString();
                default:
                    return v
            }
        });
    };

    return (
        <>
            <Box sx={{ width: "85vw", height: "90vh", padding: "0 4%" }} className="page-content">
                {emailsStatus === "success" && (
                    <TableData data={emails} isInbox={true} refetchEmails={refetch} manipulateData={manipulateData} />
                )}
            </Box>
        </>
    );
};

export default Inbox;
