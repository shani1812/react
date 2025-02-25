import { Box, Modal, Typography } from "@mui/material";
import { modalContainerStyle } from "./modalSx";
import { DetailsData, Item } from "../../types";
import AddToCart from "../addToCart/addToCart";

interface DetailedItemModalProps {
    open: boolean;
    setOpen: Function;
    detailsLabels: Record<string, String>;
    admin: boolean;
    selectedData: DetailsData;
}

const DetailedDataModal = ({
    open,
    setOpen,
    detailsLabels: itemDetailsLabels,
    admin,
    selectedData: selectedItem,
}: DetailedItemModalProps) => {
    const selectedItemDetails: Record<string, String> = {};
    Object.entries(selectedItem).map(([key, value]) => {
        if (Object.keys(itemDetailsLabels).includes(key)) {
            selectedItemDetails[key] = value;
        }
    });

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={modalContainerStyle}>
                <button onClick={() => setOpen(false)} className="x-button">
                    X
                </button>
                <div style={{ marginTop: "5%" }}>
                    {Object.entries(selectedItemDetails).map(([key, value]) => (
                        <text>
                            <text style={{ textDecoration: "underline" }}>{itemDetailsLabels[key]}:</text>
                            &nbsp;&nbsp;{value}
                            <br />
                        </text>
                    ))}
                </div>
                {!admin && (
                    <div style={{ marginTop: "5%" }}>
                        {+selectedItem!.stock! > 0 && <Typography textAlign={"center"}>add to cart</Typography>}
                        <AddToCart item={selectedItem! as Item} />
                    </div>
                )}
            </Box>
        </Modal>
    );
};

export default DetailedDataModal;
