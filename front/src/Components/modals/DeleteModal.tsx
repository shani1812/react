import { Box, Button, Modal } from "@mui/material";
import { modalButtonStyle, modalContainerStyle } from "./modalSx";
import { Item } from "../../types";

interface DeleteModalProps {
    itemsCount: number;
    handleDelete: () => void;
    setDeleteModal: Function;
    isInbox: boolean
   
   
}

const 
DeleteModal = ({
    itemsCount,
    handleDelete,
    setDeleteModal,
    isInbox
   
   
}: DeleteModalProps) => {
    return (
        <Modal open={true}>
            <Box sx={modalContainerStyle}>
                <div style={{ marginTop: "5%" }}>
                    <p>
                        Are you sure that you want to delete {itemsCount} email{itemsCount > 1 && "s"} from your {isInbox ? "inbox": "sent emails"}?
                        
                    </p>
                    <Box display={"flex"} justifyContent={"space-around"}>
                        <Button
                            sx={modalButtonStyle}
                            color="error"
                            variant="outlined"
                            onClick={handleDelete}
                            
                        >
                            Delete
                        </Button>
                        <Button sx={modalButtonStyle} variant="outlined" onClick={() => setDeleteModal(false)}>
                            cancel
                        </Button>
                    </Box>
                </div>
            </Box>
        </Modal>
    );
};

export default DeleteModal;
