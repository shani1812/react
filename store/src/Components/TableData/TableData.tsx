import { Add, Delete, Edit } from "@mui/icons-material";
import {
    Box,
    Button,
    IconButton,
    SxProps,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
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

    return (
        <Box className="table_content" sx={tableContent}>
            <div className="table_header">
                <Typography display={"inline"} color="text.primary" variant="h4">
                    {title} <small>({data.length})</small>
                </Typography>

                {setAddButton && (
                    <IconButton onClick={() => setAddButton(true)} sx={{ height: "100%" }} aria-label="delete">
                        <Add style={{ color: "rgba(31, 148, 41, 0.83)" }} fontSize="large" />
                    </IconButton>
                )}
            </div>

            <div className="table_body">
                {data.length === 0 ? (
                    <Typography color="text.primary" variant="h4">
                        no {dataType} found
                    </Typography>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {Object.values(titles).map((title) => (
                                            <TableCell>{title}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((item) => (
                                        <TableRow
                                            key={item._id + ""}
                                            sx={{
                                                border: 0,
                                            }}
                                        >
                                            {Object.entries(item).map(([k, v]) => (
                                                <>
                                                    {Object.keys(titles).includes(k) && k != "__v" && (
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                            sx={{ marginLeft: "10em" }}
                                                        >
                                                            {k === "supplier" ? v.name : v}
                                                        </TableCell>
                                                    )}
                                                </>
                                            ))}
                                            {setDataToEdit && (
                                                <TableCell component="th" scope="row">
                                                    <IconButton
                                                        sx={{ height: "100%" }}
                                                        aria-label="delete"
                                                        onClick={() => setDataToEdit(item)}
                                                    >
                                                        <Edit
                                                            style={{
                                                                color: "rgba(56, 10, 161, 0.83)",
                                                            }}
                                                            fontSize="large"
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                            )}
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
                                            {handleSelectItem && (
                                                <TableCell component="th" scope="row">
                                                    <Button
                                                        sx={{ color: "rgb(1, 9, 99)", margin: 1 }}
                                                        size="medium"
                                                        onClick={() => handleSelectItem(item)}
                                                    >
                                                        more details
                                                    </Button>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </div>
        </Box>
    );
};

export default TableData;