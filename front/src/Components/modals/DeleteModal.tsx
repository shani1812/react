import { Box, Button, Modal, SxProps } from "@mui/material";

interface DeleteModalProps {
    itemsCount: number;
    handleDelete: () => void;
    setDeleteModal: Function;
    isInbox: boolean;
}

export const deleteModalContainerStyle: SxProps = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "rgb(234, 239, 248)",
    boxShadow: 50,
    width: "25vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "min(2em, 3vw)",
    p: 4,
    minHeight: "25vh",
    "@media (max-width: 600px)": {
        width: "80vw",
    },
};
export const deleteModalButtonStyle: SxProps = {
    backgroundColor: "white",
    fontWeight: "800",
};


const DeleteModal = ({ itemsCount, handleDelete, setDeleteModal, isInbox }: DeleteModalProps) => {
    return (
        <Modal open={true}>
            <Box sx={deleteModalContainerStyle}>
                <div style={{ marginTop: "5%" }}>
                    <p>
                        Are you sure that you want to delete {itemsCount} email{itemsCount > 1 && "s"} from your{" "}
                        {isInbox ? "inbox" : "sent emails"}?
                    </p>
                    <Box display={"flex"} justifyContent={"space-around"}>
                        <Button sx={deleteModalButtonStyle} color="error" variant="outlined" onClick={handleDelete}>
                            Delete
                        </Button>
                        <Button sx={deleteModalButtonStyle} variant="outlined" onClick={() => setDeleteModal(false)}>
                            cancel
                        </Button>
                    </Box>
                </div>
            </Box>
        </Modal>
    );
};

export default DeleteModal;
