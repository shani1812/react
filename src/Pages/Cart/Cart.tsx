import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import DeleteModal from "../../Components/modals/DeleteModal";

import TableData from "../../Components/TableData/TableData";
import { Item, ItemToAdd, mail, Supplier, SupplierToAdd } from "../../types";
import "../Admin/styles.css";

import Navbar from "../../Components/NavBar";
import { getItems } from "../../axios/test";

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




    const itemTitles: Record<string, String> = {
        _id: "ID",
        name: "Name",
        price: "Price",
        stock: "Stock",
        category: "Category",
        supplier: "Supplier's Name",
        supplierPrice: "Supplier's price",
    };


      const dataa: mail[] = [
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: false },
        { addressed: "sender1", addressee: "sender2", title: "titlefelvmcdflvmdfvmcw", text: "gvevsw", date: new Date(), isRead: true },
        
    ];


    const { data: items } = useQuery("items", getItems);
    const data = [{id: "fvfvwf", name: "crcrecq"}]
    return (
        <>

            <Box sx={{width: "85vw", height: "100vh", padding: "0 4%"}} className="page-content">
            <Typography variant="h3">Hello Shani</Typography>
            <Typography variant="h5">You have {dataa.filter(data=> data.isRead).length} unread messages</Typography>
            <Typography variant="h5">{items? items :""}</Typography>
        
                          
                                <TableData
                                    data={data}
                                    setAddButton={setAddButton}
                                    setDataToEdit={setItemToEdit}
                                    setDataToDelete={setItemToDelete}
                                    dataType={"items"}
                                    titles={itemTitles}
                                    width={"70vw"}
                                    title={"items"}
                                    isInbox={true}
                                />

                              
                         
                    
               
             
                   
                
                     
            </Box>
        </>
    );
};

export default Cart;
