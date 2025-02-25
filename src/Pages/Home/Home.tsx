import { FilterAlt } from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress, FormControl, Grid2, InputLabel, MenuItem, Select, Slider, Typography } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";
import { MouseEvent, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import DetailedDataModal from "../../Components/modals/DetailedDataModal";
import ItemCard from "../../Components/ItemCard/Card";

import { DetailsData, Item } from "../../types";
import "./styles.css";

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
    },
}));

const itemDetailsLabels: Record<string, String> = {
    name: "Name",
    price: "Price",
    supplierName: "Supplier's Name",
    category: "Category",
};

const Home = () => {
   

    const [activeSortOption, setActiveSortOption] = useState<
        { ascending: null; name: string } | { ascending: boolean; name: string }
    >({ name: "", ascending: false });
    const [searchInput, setSearchInput] = useState("");
    const [availableSortOptions, setAvailableSortOptions] = useState([
        {
            ascending: null,
            name: "default",
        },
        {
            ascending: true,
            name: "name",
        },
        {
            ascending: true,
            name: "price",
        },
    ]);
    const availableFilterOptions = ["none", "category", "supplier", "price"];

    const handleSortClick = (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
        const eventTarget = event.target as HTMLInputElement;
        const option = eventTarget.childNodes[1]
            ? (eventTarget.childNodes[1] as Text).data
                ? (eventTarget.childNodes[1] as Text).data
                : (eventTarget.childNodes[0] as Text).data
            : "";

        const temp = [...availableSortOptions];
        temp.map((item) => {
            if (item.name == option && activeSortOption.name === item.name) {
                item.ascending = !item.ascending;
            }
        });

        setActiveSortOption(
            availableSortOptions.find((opt) => opt.name == option)
                ? availableSortOptions.find((opt) => opt.name == option)!
                : { ascending: null, name: "" }
        );
        setAvailableSortOptions(temp);
    };

 

   

    return (
        <>
     
                    <>
                       
                    </>
            

          
        </>
    );
};

export default Home;
