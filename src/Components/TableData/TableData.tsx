import { Add, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    IconButton,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from "@mui/material";
import { Item, Supplier, SupplierSpendingOuput } from "../../types";
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
}

const TableData = ({
    data,
    setAddButton,
    setDataToDelete,
    setDataToEdit,
    dataType,
    titles,
    width,
    title,
    handleSelectItem,
}: TableDataProps) => {
    const tableContent: SxProps = {
        width: width + "",
    };

    const dataa = [
        { sender: "sender1", title: "titlefelvmcdflvmdfvmcw" },
        { to: "sender2", title: "titlefelvmcdflvmdfvmcw" }
    ];

    return (
        <Box className="table_content" sx={tableContent}>
            <div className="table_body">
                <TableContainer
                    sx={{}}>
                    <Table>
                        <TableBody>
                            {dataa.map((item) => (
                                <TableRow key={item.sender + ""} sx={{ border: 0 }}>
                                    {Object.entries(item).map(([k, v], idx) => (
                                        <TableCell
                                            key={idx}
                                            component="th"
                                            scope="row"
                                            sx={{
                                                textAlign: "left", // Align text to the left
                                            }}
                                        >
                                            {k === "to" ? `To: ${v}` : v}
                                        </TableCell>
                                    ))}
                                    {setDataToDelete && (
                                        <TableCell component="th" scope="row">
                                            <IconButton
                                                sx={{ height: "100%" }}
                                                aria-label="delete"
                                                onClick={() => setDataToDelete(item)}
                                            >
                                                <Delete
                                                    style={{ color: "rgb(209, 26, 41)" }}
                                                    fontSize="large"
                                                />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Box>
    );
};

export default TableData;
