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
import { getCategories } from "../../axios/categories";
import { getItems } from "../../axios/items";
import { getSuppliers } from "../../axios/suppliers";
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
    const { data: items, status: itemsStatus } = useQuery("items", getItems);
    const { data: suppliers, status: supplierStatus } = useQuery("suppliers", getSuppliers, {
        enabled: itemsStatus === "success",
    });
    const { data: categories, status: categoriesStatus } = useQuery("categories", getCategories, {
        enabled: supplierStatus === "success",
    });
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [filteredItemsList, setFIlteredItemsList] = useState<Item[]>([]);
    const [activeFilters, setActiveFilters] = useState<String[]>([]);
    const [priceRange, setPriceRange] = useState<number[]>([
        Math.min(...filteredItemsList.map((item) => +item.price)),
        Math.max(...filteredItemsList.map((item) => +item.price)),
    ]);
    const [filterValue, setFIlterValue] = useState<{ supplier?: String; price?: number[]; category?: String }>({
        supplier: "",
        price: priceRange,
        category: "",
    });

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

    useEffect(() => {
        if (itemsStatus === "success") {
            setFIlteredItemsList(items!);
            setPriceRange([Math.min(...items!.map((o) => +o.price)), Math.max(...items!.map((o) => +o.price))]);
        }
    }, [items]);

    useEffect(() => {
        if (items) {
            filterAndSortList();
        }
    }, [activeSortOption?.ascending, activeSortOption?.name, filterValue, activeFilters, priceRange, searchInput]);

    let selectedItemDetails: Partial<DetailsData> = {};
    if (selectedItem) {
        Object.entries(selectedItem).map(([k, v]) => {
            if (k === "supplier") {
                selectedItemDetails["supplierName"] = v.name;
                selectedItemDetails["supplierId"] = v._id;
            }
            selectedItemDetails[k as keyof DetailsData] = v;
        });
    }

    const filterAndSortList = () => {
        let result = items!.filter((item: Item) => item.name.toLowerCase().includes(searchInput.toLowerCase()));
        switch (activeSortOption?.name) {
            case "price":
                if (availableSortOptions.find((option) => option.name === "price")?.ascending) {
                    result.sort((a, b) => +a.price - +b.price);
                } else {
                    result.sort((a, b) => +b.price - +a.price);
                }

                break;

            case "name":
                if (availableSortOptions.find((option) => option.name === "name")?.ascending) {
                    result.sort((a, b) => a.name.localeCompare(b.name + ""));
                } else {
                    result.sort((a, b) => b.name.localeCompare(a.name + ""));
                }

                break;
            case "default":
                break;
            default:
                break;
        }

        if (activeFilters.includes("supplier") && filterValue.supplier != "") {
            result = result.filter((item: Item) => {
                return item.supplier._id == filterValue.supplier;
            });
        }
        if (activeFilters.includes("category") && filterValue.category != "") {
            result = result.filter((item: Item) => item.category == filterValue.category);
        }
        if (activeFilters.includes("price") && filterValue.price?.length) {
            result = result.filter((item: Item) => +item.price >= priceRange[0] && +item.price <= priceRange[1]);
        }

        setFIlteredItemsList(result);
    };

    const handleFilter = (value: String, field: String) => {
        const temp = { ...filterValue };

        if (field === "category") {
            temp.category = value;
        } else if (field == "supplier") {
            temp.supplier = value;
        }

        setFIlterValue(temp);
    };

    const handlePriceChange = (_event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
    };

    const updateActiveFilters = (values: String[]) => {
        let temp = { ...filterValue };
        for (let k in filterValue) {
            if (!values.includes(k)) {
                if (k === "category") {
                    temp.category = "";
                } else if (k == "supplier") {
                    temp.supplier = "";
                }
            }
        }
        setFIlterValue(temp);

        if (values.includes("none") && !activeFilters.includes("none")) {
            values = ["none"];
        } else {
            values = values.filter((item) => item != "none");
        }
        setActiveFilters(values);
    };

    useEffect(() => {
        if (itemsStatus === "error" || supplierStatus === "error" || categoriesStatus === "error") {
            toast.error("something went wrong- please try again later");
        }
    }, [itemsStatus, supplierStatus, categoriesStatus]);

    return (
        <>
            {itemsStatus === "error" ? (
                <Typography variant="h4">something went wrong </Typography>
            ) : itemsStatus === "loading" ? (
                <div className="centered" style={{ alignItems: "center" }}>
                    <CircularProgress size={"10em"} />
                </div>
            ) : (
                itemsStatus === "success" && (
                    <>
                        <div className="centered">
                            <div className="top">
                                <div className="search">
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="centered">
                            <div className="top">
                                <FormControl
                                    sx={{
                                        width: 300,
                                        height: 70,
                                        color: "text.primary",
                                        border: "1.5px solid ",
                                        mb: "2em",
                                    }}
                                >
                                    <InputLabel>
                                        <FilterListIcon />
                                        sort items
                                    </InputLabel>
                                    <Select
                                        value={activeSortOption ? activeSortOption.name : ""}
                                        onClick={(e) => handleSortClick(e)}
                                        sx={{ height: "100%" }}
                                    >
                                        {availableSortOptions.map((option, index: Number) => (
                                            <MenuItem
                                                value={option.name}
                                                sx={{ fontSize: "1.3em", p: 0, width: "100%" }}
                                            >
                                                {index === 0 ? (
                                                    option.name
                                                ) : option.ascending ? (
                                                    <span style={{ width: "100%" }}> {option.name} ↓ acsending</span>
                                                ) : (
                                                    <span style={{ width: "100%" }}> {option.name} ↑ descending</span>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <div>
                                    <FormControl
                                        sx={{
                                            width: 300,
                                            height: 70,
                                            color: "text.primary",
                                            border: "1.5px solid",
                                            mb: "2em",
                                        }}
                                    >
                                        <InputLabel>
                                            <FilterAlt />
                                            filter items
                                        </InputLabel>
                                        <Select
                                            value={activeFilters}
                                            onChange={(e) =>
                                                updateActiveFilters(
                                                    Array.isArray(e.target.value) ? e.target.value : [e.target.value]
                                                )
                                            }
                                            sx={{ height: "100%" }}
                                            multiple={true}
                                        >
                                            {availableFilterOptions.map((filterOption) => (
                                                <MenuItem
                                                    value={filterOption}
                                                    sx={{ fontSize: "1.3em", p: 0, width: "100%" }}
                                                >
                                                    {filterOption}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    {activeFilters.includes("category") && (
                                        <div>
                                            <FormControl
                                                sx={{
                                                    width: 300,
                                                    height: 70,
                                                    color: "text.primary",
                                                    border: "1.5px solid ",
                                                    mb: "1em",
                                                }}
                                            >
                                                <>
                                                    <InputLabel>
                                                        <SearchIcon />
                                                        search category
                                                    </InputLabel>
                                                    <Select
                                                        value={filterValue.category}
                                                        onChange={(e) => handleFilter(e.target.value, "category")}
                                                        sx={{ height: "122%", width: "100%" }}
                                                    >
                                                        {categories &&
                                                            categories.map((category) => (
                                                                <MenuItem
                                                                    value={category.name + ""}
                                                                    sx={{ fontSize: "1.3em", p: 0, width: "100%" }}
                                                                >
                                                                    {category.name}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </>
                                            </FormControl>
                                        </div>
                                    )}
                                    {activeFilters.includes("supplier") && (
                                        <div>
                                            <FormControl
                                                sx={{
                                                    width: 300,
                                                    height: 70,
                                                    color: "text.primary",
                                                    border: "1.5px solid ",
                                                    mb: "1em",
                                                }}
                                            >
                                                <>
                                                    <InputLabel>
                                                        <SearchIcon />
                                                        search supplier
                                                    </InputLabel>
                                                    <Select
                                                        value={filterValue.supplier}
                                                        onChange={(e) => handleFilter(e.target.value, "supplier")}
                                                        sx={{ height: "122%", width: "100%" }}
                                                    >
                                                        {suppliers &&
                                                            suppliers.map((supplier) => (
                                                                <MenuItem
                                                                    value={supplier._id + ""}
                                                                    sx={{ fontSize: "1.3em", p: 0, width: "100%" }}
                                                                >
                                                                    {supplier.name}
                                                                </MenuItem>
                                                            ))}
                                                    </Select>
                                                </>
                                            </FormControl>
                                        </div>
                                    )}
                                    {activeFilters.includes("price") && (
                                        <div>
                                            <FormControl
                                                sx={{
                                                    width: 300,
                                                    height: 70,
                                                    color: "text.primary",
                                                    border: "none",
                                                    mb: "1em",
                                                }}
                                            >
                                                <>
                                                    <InputLabel>filter by price</InputLabel>
                                                    <Slider
                                                        max={Math.max(...items!.map((o) => +o.price))}
                                                        min={Math.min(...items!.map((o) => +o.price))}
                                                        valueLabelDisplay="auto"
                                                        marks={[
                                                            {
                                                                value: Math.max(...items!.map((o) => +o.price)),
                                                                label: Math.max(...items!.map((o) => +o.price)),
                                                            },
                                                            {
                                                                label: Math.min(...items!.map((o) => +o.price)),
                                                                value: Math.min(...items!.map((o) => +o.price)),
                                                            },
                                                        ]}
                                                        value={priceRange}
                                                        onChange={handlePriceChange}
                                                    />
                                                </>
                                            </FormControl>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {filteredItemsList.length ? (
                            <Grid2 className="card-deck" container rowSpacing={2} columnSpacing={1}>
                                {filteredItemsList.map((item: Item) => (
                                    <Grid2>
                                        <ItemCard
                                            item={item}
                                            handleOpen={() => setOpen(true)}
                                            chosenItem={selectedItem!}
                                            setChosenItem={setSelectedItem}
                                        />
                                    </Grid2>
                                ))}
                            </Grid2>
                        ) : (
                            <text>No items match your search</text>
                        )}
                    </>
                )
            )}

            {selectedItemDetails && (
                <DetailedDataModal
                    open={open}
                    setOpen={setOpen}
                    selectedData={selectedItemDetails as DetailsData}
                    detailsLabels={itemDetailsLabels}
                    admin={false}
                />
            )}
        </>
    );
};

export default Home;
