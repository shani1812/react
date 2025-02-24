import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { UseMutationResult, useQuery } from "react-query";
import { modalButtonStyle, modalContainerStyle } from "./modalSx";
import { getItemById } from "../../axios/items";
import { Item } from "../../types";

interface EditModalProps {
    dataToEdit: Item;
    setDataToEdit: Function;
    query: UseMutationResult<void, unknown, void, unknown>;
}

const EditModal = ({ setDataToEdit, dataToEdit, query }: EditModalProps) => {
    const [submitEditingButton, setSubmitEditingButton] = useState(false);
    const originalItem = useQuery("item", () => getItemById(dataToEdit._id!));
    function handleFieldChangeInEditItem<K extends keyof Item>(field: K, value: Item[K]) {
        if ((typeof value === "number" && value != 0) || (typeof value === "string" && value != ""))
            setDataToEdit({ ...dataToEdit!, [field]: value });
        else {
            const temp = { ...dataToEdit! };
            temp[field] = originalItem.data![field];
            setDataToEdit(temp);
        }
    }

    const formValidation = () => {
        if (+dataToEdit.price >= +dataToEdit.supplierPrice * 1.3) return true;
        return false;
    };

    const textFields = [
        {
            label: "name",
            type: "text",
            onchange: (e: { target: { value: String } }) => handleFieldChangeInEditItem("name", e.target.value),
            value: dataToEdit?.name,
        },
        {
            label: "price",
            type: "number",
            onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleFieldChangeInEditItem("price", +e.target.value),
            value: dataToEdit?.price,
            error: submitEditingButton && +dataToEdit.price < +dataToEdit!.supplierPrice! * 1.3,
            helperText: submitEditingButton
                ? dataToEdit.supplierPrice && +dataToEdit.price <= +dataToEdit!.supplierPrice! * 1.3
                    ? "price has to be at least 30% higher than the supplier price"
                    : ""
                : "",
        },
        {
            label: "stock",
            type: "number",
            onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleFieldChangeInEditItem("stock", +e.target.value),
            value: dataToEdit?.stock,
        },
        {
            label: "supplier's price",
            type: "number",
            onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleFieldChangeInEditItem("supplierPrice", +e.target.value),
            value: dataToEdit?.supplierPrice,
        },
        {
            label: "category",
            onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleFieldChangeInEditItem("category", e.target.value),
            value: dataToEdit?.category,
        },
    ];

    const editData = (e: React.FormEvent<HTMLFormElement>) => {
        setSubmitEditingButton(true);
        e.preventDefault();
        if (formValidation()) {
            query.mutate();
            setDataToEdit(null);
            setSubmitEditingButton(false);
        }
    };

    const exitModal = () => {
        setDataToEdit(null);
        setSubmitEditingButton(false);
    };

    return (
        <Modal open={true}>
            <Box sx={modalContainerStyle}>
                <div style={{ marginTop: "5%" }}>
                    <Typography variant="h4">edit item </Typography>

                    <form onSubmit={(e) => editData(e)}>
                        {textFields.map((textField) => (
                            <TextField
                                label={textField.label}
                                variant="standard"
                                fullWidth
                                onChange={textField.onchange}
                                margin="normal"
                                value={textField.value}
                                error={textField.error}
                                helperText={textField.helperText}
                            />
                        ))}

                        <Button variant="outlined" sx={modalButtonStyle} color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </div>
                <button onClick={exitModal} className="x-button">
                    X
                </button>
            </Box>
        </Modal>
    );
};

export default EditModal;
