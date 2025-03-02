import { Box } from "@mui/material";
import { useQuery } from "react-query";
import TableData from "../../Components/EmailsTable";
import { getSentEmails } from "../../axios/emails";
import { getCurrentUser } from "../../axios/users";

const Sent = () => {
    const { data: curr } = useQuery("current-user", getCurrentUser);
    const {
        data: emails,
        status: emailsStatus,
        refetch,
    } = useQuery("sent", () => getSentEmails(curr!.id), {
        enabled: !!curr?.id,
    });

    return (
        <>
            <Box sx={{ width: "85vw", height: "90vh", padding: "0 4%" }} className="page-content">
                {emailsStatus === "success" && <TableData data={emails} isInbox={false} refetchEmails={refetch} />}
            </Box>
        </>
    );
};

export default Sent;
