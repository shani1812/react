import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";

import DeleteModal from "../../Components/modals/DeleteModal";

import TableData from "../../Components/TableData/TableData";
import { Item, ItemToAdd, mail, Supplier, SupplierToAdd } from "../../types";
import "../Admin/styles.css";

import Navbar from "../../Components/NavBar";
import { getCurrentUser, getUserById } from "../../axios/users";
import { getInbox } from "../../axios/emails";

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





   
    const { data: curr } = useQuery("items",()=> getCurrentUser("cart"));
    const { data: emails, status: emailsStatus, refetch } = useQuery(
        "inbox",
        () => getInbox(curr?.id), // Function that fetches emails
        {
          // Conditionally enable the query
          enabled: !!curr?.id,  // Only run the query if `curr?.id` exists and is not undefined or null
        }
      );
   
    
    return (
        <>

            <Box sx={{width: "85vw", height: "90vh", padding: "0 4%"}} className="page-content">
            {/* <Typography variant="h3">Hello {curr?.name}</Typography>
            <Typography variant="h5">You have {emails?.filter(data=> data.isRead).length} unread messages</Typography> */}
            {/* <Typography variant="h5">{items? items.name :""}</Typography> */}
        
                          
                               {emailsStatus === "success" && <TableData
                                    data={emails}
                                    setAddButton={setAddButton}
                                    setDataToEdit={setItemToEdit}
                                    setDataToDelete={setItemToDelete}
                                    dataType={"items"}
                                    titles={itemTitles}
                                    width={"70vw"}
                                    title={"items"}
                                    isInbox={true}
                                    refetchEmails={refetch}
                                />}

                              
                         
                    
               
             
                   
                
                     
            </Box>
        </>
    );
};

export default Cart;
