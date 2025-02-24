import { Button, Card, CardActions, CardContent, Grid2, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { getDailyMostProfitableItem, getEdgeProfitMarginItems, getItems } from "../../axios/items";
import { getMonthlyRevenues, getWeeklyMostProfitableCategory } from "../../axios/orders";
import { getMostProfitableSupplier, getSuppliersExpenses } from "../../axios/suppliers";
import { DetailsData, Item, Supplier } from "../../types";
import DetailedDataModal from "../modals/DetailedDataModal";
import "./styles.css";
import TableData from "../TableData/TableData";

const Analytics=()=> {
    const { data: items } = useQuery("items", getItems);
    const { data: monthlyRevnues } = useQuery("monthly-revenues", getMonthlyRevenues);
    const { data: weeklyMostProfitableCategory } = useQuery(
        "weeklyMostProfitableCategory",
        getWeeklyMostProfitableCategory
    );
    const { data: dailyMostProfitableItem } = useQuery("dailyMostProfitableItem", getDailyMostProfitableItem);
    const { data: mostProfitableSupplier } = useQuery("mostProfitableSupplier", getMostProfitableSupplier);
    const { data: profitMarginItems } = useQuery("profitMarginItems", getEdgeProfitMarginItems);
    const { data: suppliersExpenses } = useQuery("suppliersExpenses", getSuppliersExpenses);
    const [selectedData, setSelectedData] = useState<Item | Supplier | null>(null);
    const [open, setOpen] = useState(false);
    const lowStockItems = items?.filter((item) => +item.stock < 5);
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
            text: String(items?.length),
            changeSelectedData: undefined
        },
        {
            class: "analystics-top-card",
            title: "monthy revenues",
            text: `${monthlyRevnues}$`,
            changeSelectedData: undefined
        },
         {

            class: "analystics-top-card",
            title: "weekly most profitable category",
            text: weeklyMostProfitableCategory,
            changeSelectedData: undefined
        }, 
        {
            class: "analystics-top-card",
            title: "daily most profitable item",
            text: dailyMostProfitableItem?.item.name,
            changeSelectedData: dailyMostProfitableItem?.item
        }, 
        {
            class: "analystics-top-card",
            title: "most profitable supplier",
            text: mostProfitableSupplier?.supplier.name,
            changeSelectedData: mostProfitableSupplier?.supplier
        },
     
    ]

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

                            <Typography variant="h4">{profitMarginItems?.highestProfitMargin.name}</Typography>
                            <Button
                                sx={{ color: "rgb(1, 9, 99)", margin: 1 }}
                                size="medium"
                                onClick={() => handleSelectData(profitMarginItems!.highestProfitMargin)}
                            >
                                more details
                            </Button>
                        </CardContent>
                        <CardContent>
                            <Typography>lowest profit margin item:</Typography>

                            <Typography variant="h4">{profitMarginItems?.lowestProfitMargin.name}</Typography>
                            <Button
                                sx={{ color: "rgb(1, 9, 99)", margin: 1 }}
                                size="medium"
                                onClick={() => handleSelectData(profitMarginItems!.lowestProfitMargin)}
                            >
                                more details
                            </Button>
                        </CardContent>
                    </Card>
                </Grid2>
                <Grid2>
                    <Card className="analystics-bottom-card">
                        <TableData
                            data={lowStockItems!}
                            dataType={"items"}
                            titles={lowStockItemsTitles}
                            title={"items low on stock"}
                            width={"100%"}
                            handleSelectItem={handleSelectData}
                        />
                    </Card>
                </Grid2>

                {suppliersExpenses && (
                    <Grid2>
                        <Card className="analystics-bottom-card">
                            <TableData
                                data={suppliersExpenses}
                                dataType={"suppliers"}
                                titles={suppliersExpensesTitles}
                                title={"expenses on suppliers"}
                                width={"100%"}
                                handleSelectItem={handleSelectData}
                            />
                        </Card>
                    </Grid2>
                )}
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
