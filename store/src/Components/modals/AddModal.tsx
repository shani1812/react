import { Box, Button, MenuItem, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { UseMutationResult, useQuery } from "react-query";
import { modalButtonStyle, modalContainerStyle } from "./modalSx";
import { getSuppliers } from "../../axios/suppliers";
import { AddTextFields, ItemToAdd, SupplierToAdd } from "../../types";

interface AddModalProps {
    setAddButton: Function;
    type: String;
    query: UseMutationResult<void, unknown, void, unknown>;
    setDataToAdd: Function;
    dataToAdd: Partial<ItemToAdd> | Partial<SupplierToAdd>;
}

const AddModal = ({ setAddButton, type, query, setDataToAdd, dataToAdd: itemToAdd }: AddModalProps) => {
    const item = itemToAdd as Partial<ItemToAdd>;
    const supplier = itemToAdd as Partial<SupplierToAdd>;

    const [submitAddingButton, setSubmitAddingButton] = useState(false);
    const formValidation = () => {
        if (
            (type === "item" &&
                item &&
                item.name &&
                item.category &&
                item.price &&
                item.supplier &&
                item.supplierPrice &&
                +item.price >= +item.supplierPrice * 1.3) ||
            (type === "supplier" && supplier && supplier.name)
        )
            return true;
        return false;
    };

    function handleFieldChangeInAddItem<K extends keyof ItemToAdd>(field: K, value: ItemToAdd[K]) {
        if ((typeof value === "number" && value !== 0) || (typeof value === "string" && value != ""))
            setDataToAdd({ ...itemToAdd!, [field]: value });
        else {
            const temp = { ...(itemToAdd as ItemToAdd) };
            delete temp[field];
            setDataToAdd(temp);
        }
    }

    function handleFieldChangeInAddSupplier<K extends keyof SupplierToAdd>(field: K, value: SupplierToAdd[K]) {
        if ((typeof value === "number" && value !== 0) || (typeof value === "string" && value != ""))
            setDataToAdd({ ...itemToAdd!, [field]: value });
        else {
            const temp = { ...(itemToAdd as SupplierToAdd) };
            delete temp[field];
            setDataToAdd(temp);
        }
    }

    const { data: suppliers } = useQuery("suppliers", getSuppliers);

    const textFields: AddTextFields[] =
        type === "item"
            ? [
                  {
                      label: "name",
                      type: "text",
                      error: submitAddingButton && !itemToAdd!.name,
                      helperText: submitAddingButton && !itemToAdd!.name ? "name is required" : "",
                      onchange: (e: { target: { value: String } }) =>
                          handleFieldChangeInAddItem("name", e.target.value),
                  },
                  {
                      label: "price",
                      type: "number",
                      error:
                          submitAddingButton &&
                          (!item!.price || (item.supplierPrice && +item.price < +item!.supplierPrice! * 1.3)),
                      helperText: submitAddingButton
                          ? !item!.price
                              ? "price is required"
                              : item.supplierPrice && +item.price < +item!.supplierPrice! * 1.3
                              ? "price has to be at least 30% higher than the supplier price"
                              : ""
                          : "",
                      onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleFieldChangeInAddItem("price", +e.target.value),
                  },
                  {
                      label: "stock",
                      type: "number",
                      error: submitAddingButton && !item!.stock,
                      helperText: submitAddingButton && !item!.stock ? "stock is required" : "",
                      onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleFieldChangeInAddItem("stock", +e.target.value),
                  },
                  {
                      label: "supplier",
                      select: true,
                      error: submitAddingButton && (item!.supplier === "" || !item!.supplier),
                      helperText:
                          submitAddingButton && (item!.supplier === "" || !item!.supplier)
                              ? "supplier is required"
                              : "",
                      onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleFieldChangeInAddItem("supplier", e.target.value),
                      sx: {
                          textAlign: "left",
                      },
                      supplier: suppliers,
                  },
                  {
                      label: "supplier's price",
                      type: "number",
                      error: submitAddingButton && !item!.supplierPrice,
                      helperText:
                          submitAddingButton && submitAddingButton && !item!.supplierPrice
                              ? "supplier's price is required"
                              : "",
                      onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleFieldChangeInAddItem("supplierPrice", +e.target.value),
                  },
                  {
                      label: "category",
                      type: "text",
                      error: submitAddingButton && !item!.category,
                      helperText: submitAddingButton && !item!.category ? "category price is required" : "",
                      onchange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          handleFieldChangeInAddItem("category", e.target.value),
                  },
              ]
            : [
                  {
                      label: "name",
                      type: "text",
                      error: submitAddingButton && !supplier!.name,
                      helperText: submitAddingButton && !supplier!.name ? "name is required" : "",
                      onchange: (e: { target: { value: String } }) =>
                          handleFieldChangeInAddSupplier("name", e.target.value),
                  },
              ];
    const exitModal = () => {
        setAddButton(false);
        setSubmitAddingButton(false);
        setDataToAdd({});
    };

    const addItem = (e: React.FormEvent<HTMLFormElement>) => {
        setSubmitAddingButton(true);
        e.preventDefault();
        if (formValidation()) {
            query.mutate();
            exitModal();
            setDataToAdd({});
        }
    };
    return (
        <Modal open={true}>
            <Box sx={modalContainerStyle}>
                <div style={{ marginTop: "5%" }}>
                    <Typography variant="h4">add {type}</Typography>

                    <form onSubmit={(e) => addItem(e)}>
                        {textFields.map((item) => (
                            <TextField
                                sx={item.sx}
                                label={item.label}
                                type={item.type}
                                variant="standard"
                                fullWidth
                                select={item.select}
                                onChange={item.onchange}
                                margin="normal"
                                error={item.error}
                                helperText={item.helperText}
                            >
                                {item.select &&
                                    item.supplier &&
                                    item.supplier.map((supplier) => (
                                        <MenuItem
                                            value={supplier._id + ""}
                                            style={{
                                                fontSize: "1.3em",
                                                padding: 0,
                                                width: "100%",
                                            }}
                                        >
                                            {supplier.name}
                                        </MenuItem>
                                    ))}
                            </TextField>
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

export default AddModal;
