import { Button, Card, CardActions, CardContent, Grid2, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { DetailsData, Item, Supplier } from "../../types";
import DetailedDataModal from "../modals/DetailedDataModal";
import "./styles.css";
import TableData from "../TableData/TableData";

const Analytics=()=> {
    const [selectedData, setSelectedData] = useState<Item | Supplier | null>(null);
    const [open, setOpen] = useState(false);
   
    const lowStockItemsTitles: Record<string, String> = {
        name: "Name",
        stock: "Stock",
    };

    const suppliersExpensesTitles: Record<string, String> = {
        name: "Name",
        moneySpent: "Expenses",
    };

    const handleSelectData = (item: Item | Supplier) => {
        setSelectedData(item);
        setOpen(true);
    };

    let selectedItemDetails: Partial<DetailsData> = {};
    if (selectedData) {
        Object.entries(selectedData).map(([k, v]) => {
            if (k === "supplier") {
                selectedItemDetails["supplierName"] = v.name;
                selectedItemDetails["supplierId"] = v._id;
            }
            selectedItemDetails[k as keyof DetailsData] = v;
        });
    }

    const detailsLabels: Record<string, String> = {
        name: "Name",
        _id: "ID",
        price: "Price",
        supplierPrice: "Supplier's price",
        supplierName: "Supplier's Name",
        category: "Category",
        supplierId: "Supplier's ID",
        stock: "stock",
    };
    const topCards: {class: string, title: string, text: String | undefined, changeSelectedData: Supplier | Item | undefined}[] = [
        {
            class: "analystics-top-card",
            title: "amount of items",
            text: "23232",
            changeSelectedData: undefined
        },
        {
            class: "analystics-top-card",
            title: "monthy revenues",
            text: `ujuj`,
            changeSelectedData: undefined
        },
         {

            class: "analystics-top-card",
            title: "weekly most profitable category",
            text: "eccwq",
            changeSelectedData: undefined
        }, 
        {
            class: "analystics-top-card",
            title: "daily most profitable item",
            text: "cerfrec",
            changeSelectedData: undefined
          
        }, 
        {
            class: "analystics-top-card",
            title: "most profitable supplier",
            text: "Vfcde",
            changeSelectedData: undefined

           
        },
     
    ]

    const data: Supplier[] =  [{_id: "fvfvwf", name: "crcrecq"}]
    return (
        <>
            <Grid2
                className="analystics-card-deck"
                container
                rowSpacing={2}
                columnSpacing={2}
                alignItems="center"
                justifyContent="center"
            >
                {topCards.map(card=> 
                    <Card className={card.class} color="text.primary">
                    <CardContent>
                        <Typography>{card.title}</Typography>
                        <Typography variant="h4">{card.text}</Typography>
                    </CardContent>
                    {card.changeSelectedData && <CardActions>
                            <Button
                                sx={{ color: "rgb(1, 9, 99)", margin: 1 }}
                                size="medium"
                                onClick={() => handleSelectData(card.changeSelectedData!)}
                            >
                                more details
                            </Button>
                        </CardActions>}
                </Card>
                )}
                <Grid2>
                    <Card className="analystics-bottom-card" color="text.primary">
                        <CardContent>
                            <Typography>highest profit margin item:</Typography>

                            <Typography variant="h4">{"Frewf"}</Typography>
                            <Button
                                sx={{ color: "rgb(1, 9, 99)", margin: 1 }}
                                size="medium"
                               
                            >
                                more details
                            </Button>
                        </CardContent>
                        <CardContent>
                            <Typography>lowest profit margin item:</Typography>

                            <Typography variant="h4">{"ddcq"}</Typography>
                            <Button
                                sx={{ color: "rgb(1, 9, 99)", margin: 1 }}
                                size="medium"
                
                            >
                                more details
                            </Button>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2>
                    <Card className="analystics-bottom-card">
                        <TableData
                            data={data}
                            dataType={"items"}
                            titles={lowStockItemsTitles}
                            title={"items low on stock"}
                            width={"100%"}
                            handleSelectItem={handleSelectData}
                        />
                    </Card>
                </Grid2>

                
                    <Grid2>
                        <Card className="analystics-bottom-card">
                            <TableData
                                data={data}
                                dataType={"suppliers"}
                                titles={suppliersExpensesTitles}
                                title={"expenses on suppliers"}
                                width={"100%"}
                                handleSelectItem={handleSelectData}
                            />
                        </Card>
                    </Grid2>
                
            </Grid2>

            <DetailedDataModal
                open={open}
                setOpen={setOpen}
                selectedData={selectedItemDetails as DetailsData}
                detailsLabels={detailsLabels}
                admin={true}
            />
        </>
    );
}

export default Analytics;
