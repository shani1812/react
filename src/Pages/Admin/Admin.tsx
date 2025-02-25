import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import DeleteModal from "../../Components/modals/DeleteModal";

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

const Cart = () => {
    // state of item or suppliers objects to add, delete or edit
    const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Item | null>(null);
    const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
    const [itemToAdd, setItemToAdd] = useState<Partial<ItemToAdd>>({});
    const [supplierToAdd, setSupplierToAdd] = useState<Partial<Supplier>>({});

    // is add button clicked
    const [addButton, setAddButton] = useState<boolean>(false);





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


    const data = [{id: "fvfvwf", name: "crcrecq"}]
    return (
        <>
            <Box sx={{ width: "100%"}}>
             
               
                    
                          
                                <TableData
                                    data={data}
                                    setAddButton={setAddButton}
                                    setDataToEdit={setItemToEdit}
                                    setDataToDelete={setItemToDelete}
                                    dataType={"items"}
                                    titles={itemTitles}
                                    width={"70vw"}
                                    title={"items"}
                                />

                              
                         
                    
               
             
                   
                
                     
            </Box>
        </>
    );
};

export default Cart;
