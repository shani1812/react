import { Box, Button, Modal } from "@mui/material";
import { modalButtonStyle, modalContainerStyle } from "./modalSx";
import { Item } from "../../types";

interface DeleteModalProps {
    itemToDelete: Item;
    setItemToDelete: Function;
    handleDelete: Function;
    dataType: String;
    fromCart: boolean;
}

const DeleteModal = ({
    itemToDelete,
    handleDelete,
    setItemToDelete,
    fromCart,
    dataType: data,
}: DeleteModalProps) => {
    return (
        <Modal open={true}>
            <Box sx={modalContainerStyle}>
                <div style={{ marginTop: "5%" }}>
                    <p>
                        Are you sure that you want to delete {data} "<strong>{itemToDelete.name}</strong>"
                        {fromCart && "from your cart"}?
                    </p>
                    <Box display={"flex"} justifyContent={"space-around"}>
                        <Button
                            sx={modalButtonStyle}
                            color="error"
                            variant="outlined"
                            onClick={() => handleDelete(data)}
                        >
                            Remove
                        </Button>
                        <Button sx={modalButtonStyle} variant="outlined" onClick={() => setItemToDelete(null)}>
                            cancel
                        </Button>
                    </Box>
                </div>
            </Box>
        </Modal>
    );
};

export default DeleteModal;
