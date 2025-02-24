import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { addItem as addItemAxios, deleteItem, getItems, updateItem as updateItemAxios } from "../../axios/items";
import { addSupplier as addSupplierAxios, deleteSupplier, getSuppliers } from "../../axios/suppliers";
import AddModal from "../../Components/modals/AddModal";
import DeleteModal from "../../Components/modals/DeleteModal";
import EditModal from "../../Components/modals/EditModal";
import TableData from "../../Components/TableData/TableData";
import { Item, ItemToAdd, Supplier, SupplierToAdd } from "../../types";
import "../Admin/styles.css";
import Analytics from "../../Components/Analytics/Analytics";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index } = props;

    return <div id={`simple-tabpanel-${index}`}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

const Admin = () => {
    // state of item or suppliers objects to add, delete or edit
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Item | null>(null);
    const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
    const [itemToAdd, setItemToAdd] = useState<Partial<ItemToAdd>>({});
    const [supplierToAdd, setSupplierToAdd] = useState<Partial<Supplier>>({});

    // is add button clicked
    const [addButton, setAddButton] = useState<boolean>(false);

    // items and suppliers
    const {
        data: items,
        refetch: refetchItems,
        status: itemsStatus,
    } = useQuery({ queryKey: ["items"], queryFn: getItems });
    const { data: suppliers, refetch: refetchSuppliers, status: suppliersStatus } = useQuery("suppliers", getSuppliers);

    // add, update and delete queries
    const addItemQuery = useMutation(() => addItemAxios(itemToAdd as ItemToAdd, refetchItems));
    const editItemQuery = useMutation(() => updateItemAxios(itemToEdit, refetchItems));
    const deleteItemQuery = useMutation(() => deleteItem(itemToDelete?._id!, refetchItems));
    const addSupplierQuery = useMutation(() => addSupplierAxios(supplierToAdd as SupplierToAdd, refetchSuppliers));
    const deleteSupplierQuery = useMutation(() =>
        deleteSupplier(supplierToDelete?._id!, refetchSuppliers, refetchItems)
    );

    const [selectedTabValue, setSelectedTabValue] = useState(0);

    const itemTitles: Record<string, String> = {
        _id: "ID",
        name: "Name",
        price: "Price",
        stock: "Stock",
        category: "Category",
        supplier: "Supplier's Name",
        supplierPrice: "Supplier's price",
    };

    const supplierTitles: Record<string, String> = {
        _id: "ID",
        name: "Name",
    };

    useEffect(() => {
        if (itemsStatus === "error" || suppliersStatus === "error") {
            toast.error("something went wrong. please try again later");
        }
    }, [itemsStatus, suppliersStatus]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setSelectedTabValue(newValue);
    };

    const handleDeleteData = async (type: String) => {
        if (type === "item") {
            deleteItemQuery.mutate();
            setItemToDelete(null);
        } else if (type === "supplier") {
            deleteSupplierQuery.mutate();
            setSupplierToDelete(null);
        }
    };

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs value={selectedTabValue} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Items" />
                        <Tab label="suppleirs" />
                        <Tab label="analystics" />
                    </Tabs>
                </Box>
                <CustomTabPanel value={selectedTabValue} index={0}>
                    {itemsStatus === "error" ? (
                        <Typography variant="h4">something went wrong </Typography>
                    ) : itemsStatus === "loading" ? (
                        <div className="centered">
                            <CircularProgress size={"10em"} />
                        </div>
                    ) : (
                        itemsStatus === "success" && (
                            <>
                                <TableData
                                    data={items}
                                    setAddButton={setAddButton}
                                    setDataToEdit={setItemToEdit}
                                    setDataToDelete={setItemToDelete}
                                    dataType={"items"}
                                    titles={itemTitles}
                                    width={"70vw"}
                                    title={"items"}
                                />

                                {itemToDelete && (
                                    <DeleteModal
                                        itemToDelete={itemToDelete}
                                        setItemToDelete={setItemToDelete}
                                        handleDelete={handleDeleteData}
                                        fromCart={false}
                                        dataType={"item"}
                                    />
                                )}
                                {itemToEdit && (
                                    <EditModal
                                        dataToEdit={itemToEdit}
                                        setDataToEdit={setItemToEdit}
                                        query={editItemQuery}
                                    />
                                )}
                                {addButton && (
                                    <AddModal
                                        setAddButton={setAddButton}
                                        type={"item"}
                                        query={addItemQuery}
                                        setDataToAdd={setItemToAdd}
                                        dataToAdd={itemToAdd}
                                    />
                                )}
                            </>
                        )
                    )}
                </CustomTabPanel>
                <CustomTabPanel value={selectedTabValue} index={1}>
                    {suppliersStatus === "error" ? (
                        <Typography variant="h4">something went wrong</Typography>
                    ) : suppliersStatus === "loading" ? (
                        <div className="centered">
                            <CircularProgress size={"10em"} />
                        </div>
                    ) : (
                        suppliersStatus === "success" && (
                            <>
                                <TableData
                                    data={suppliers!}
                                    setAddButton={setAddButton}
                                    setDataToDelete={setSupplierToDelete}
                                    dataType={"suppliers"}
                                    titles={supplierTitles}
                                    width={"70vw"}
                                    title={"suppliers"}
                                />

                                {supplierToDelete && (
                                    <DeleteModal
                                        itemToDelete={supplierToDelete}
                                        setItemToDelete={setSupplierToDelete}
                                        handleDelete={handleDeleteData}
                                        fromCart={false}
                                        dataType={"supplier"}
                                    />
                                )}
                                {addButton && (
                                    <AddModal
                                        setAddButton={setAddButton}
                                        type={"supplier"}
                                        query={addSupplierQuery}
                                        setDataToAdd={setSupplierToAdd}
                                        dataToAdd={supplierToAdd}
                                    />
                                )}
                            </>
                        )
                    )}
                </CustomTabPanel>
                <CustomTabPanel value={selectedTabValue} index={2}>
                    <Analytics />
                </CustomTabPanel>
            </Box>
        </>
    );
};

export default Admin;
