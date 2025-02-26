import { DeleteRounded, FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage, Search } from "@mui/icons-material";
import {
    Box,
    Checkbox,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    TextField,
    InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import { Item, mail, Supplier, SupplierSpendingOuput } from "../../types";
import "./styles.css";

interface TableDataProps {
    data: Item[] | Supplier[] | SupplierSpendingOuput[];
    setAddButton?: Function;
    setDataToEdit?: Function;
    setDataToDelete?: Function;
    dataType: String;
    titles: Record<string, String>;
    width: String;
    title: String;
    handleSelectItem?: Function;
    isInbox: boolean;
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                <FirstPage />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                <LastPage />
            </IconButton>
        </Box>
    );
}

const TableData = ({
    setDataToDelete,
    isInbox,
}: TableDataProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(15); // Fixed to 10 rows per page
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // Track selected rows
    const [searchTerm, setSearchTerm] = useState(""); // State for the search input

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // Sample data (replace with your dynamic data)
    let dataa: mail[] = [
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: false,
        },
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: true,
        },
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: false,
        },
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: true,
        },
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: false,
        },
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: true,
        },
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: false,
        },
        {
            addressed: "sender1",
            addressee: "sender2",
            title: "titlefelvmcdflvmdfvmcw",
            text: "gvevsw",
            date: new Date(),
            isRead: true,
        },
    ];

    dataa = dataa.map((data) => {
        // Convert date to a string
        data.date = (data.date as Date).toDateString();

        // Remove a specific field (example: remove 'age' field, or any other field)
        const { text, ...rest } = data; // Example of removing 'age' field

        return rest; // Return the object without the 'age' field
    });

    // Filter data based on search term
    const filteredData = dataa.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Get paginated data
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Handle checkbox toggle
    const handleRowSelection = (index: number) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(index)) {
            newSelectedRows.delete(index);
        } else {
            newSelectedRows.add(index);
        }
        setSelectedRows(newSelectedRows);
    };

    // Delete selected rows
    const handleDeleteSelected = () => {
        // Implement the logic to delete selected rows
        if (setDataToDelete) {
            const rowsToDelete = paginatedData.filter((_, index) => selectedRows.has(index));

            rowsToDelete.forEach((row) => setDataToDelete(row));
            setSelectedRows(new Set()); // Clear selection after deletion
        }
    };

    return (
        <Box className="table_content" sx={{marginTop: 2}}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px', width: "100%", borderRadius: "30px" }}>
                <TextField
                   
                    placeholder="Search..."
                    sx={{borderRadius: "16px"}}
                    
                    onChange={handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment sx={{borderRadius: "50px"}} position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableHead sx={{ display: "flex", justifyContent: "left", alignItems: "center", marginBottom: "10px" }}>
                
                <IconButton sx={{ color: selectedRows.size ? "red" : "" }} onClick={handleDeleteSelected}>
                    <DeleteRounded />
                </IconButton>
                <Typography variant="h6">{selectedRows.size ? `${selectedRows.size} selected` : ""}</Typography>
            </TableHead>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow
                                key={index + ""}
                                sx={{
                                    border: 0,
                                    bgcolor: selectedRows.has(index) ? "rgba(128, 128, 128, 0.233)" : item.isRead ? "" : "rgb(223, 231, 245, 0.5)",
                                    height: "10px",
                                }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox checked={selectedRows.has(index)} onChange={() => handleRowSelection(index)} />
                                </TableCell>
                                {Object.entries(item).map(([k, v], idx) => {
                                    const displayValue =
                                        k === "addressed" && isInbox
                                            ? `from: ${v}`
                                            : k === "addressed" && !isInbox
                                            ? ""
                                            : k === "addressee" && isInbox
                                            ? ""
                                            : k === "addressee" && !isInbox
                                            ? `to: ${v}`
                                            : k === "title"
                                            ? `topic: "${v}"`
                                            : k === "isRead"
                                            ? ""
                                            : String(v);

                                    if (displayValue !== "") {
                                        return (
                                            <TableCell
                                                key={idx}
                                                component="th"
                                                scope="row"
                                                sx={{
                                                    textAlign: "left",
                                                    padding: "4px 8px",
                                                }}
                                            >
                                                {displayValue}
                                            </TableCell>
                                        );
                                    }
                                    return null;
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[]}
                                colSpan={3}
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TableData;
