import { DeleteRounded, FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage, Search } from "@mui/icons-material";
import {
    Box,
    Checkbox,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { deleteEmailFromInbox, deleteEmailFromSent, getInbox } from "../../axios/emails";
import { getCurrentUser } from "../../axios/users";
import { Email } from "../../types";
import DeleteModal from "../modals/DeleteModal";
import "./styles.css";

interface TableDataProps {
    data: Email[];
    setAddButton?: Function;
    setDataToEdit?: Function;
    setDataToDelete?: Function;
    dataType: String;
    titles: Record<string, String>;
    width: String;
    title: String;
    handleSelectItem?: Function;
    isInbox: boolean;
    refetchEmails: Function;
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

const TableData = ({ setDataToDelete, isInbox, data, refetchEmails }: TableDataProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(15); // Fixed to 10 rows per page
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // Track selected rows
    const [searchTerm, setSearchTerm] = useState(""); // State for the search input

    const deleteEmail = isInbox ? deleteEmailFromInbox : deleteEmailFromSent;

    const { mutate: deleteEmailMutation } = useMutation(deleteEmail, {
        onSuccess: () => {
            refetchEmails();
        },
    });
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    data = data.map((data) => {
        data.date = new Date(data.date).toLocaleString();
        return data;
    });

    const filteredData = data.filter((item) =>
        Object.entries(item).some(([key, value]) => {
            if ((key === "addressee" && isInbox) || (key === "addressed" && !isInbox)) {
                return value.emailAddress && value.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
    );

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleRowSelection = (index: number) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(index)) {
            newSelectedRows.delete(index);
        } else {
            newSelectedRows.add(index);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleDeleteSelected = () => {
        if (setDataToDelete) {
            const rowsToDelete = paginatedData.filter((_, index) => selectedRows.has(index));

            for (const email of rowsToDelete) {
                deleteEmailMutation(email.id);
            }

            setSelectedRows(new Set());
            setDeleteModal(false);
        }
    };

    const { data: curr } = useQuery("items", getCurrentUser);
    const { data: inbox, status: inboxStatus } = useQuery("inbox", () => getInbox(curr?.id), {
        enabled: !!curr?.id,
    });

    const [deleteModal, setDeleteModal] = useState<boolean>(false);

    const navigate = useNavigate(); 

   
    const handleRowClick = (emailId: String) => {
        navigate(`/${isInbox ? "" : "sent/"}${emailId}`); 
    };

    return (
        <div>
            <Typography variant="h3">Hello {curr?.name}</Typography>
            {inboxStatus === "success" && (
                <Typography variant="h5">
                    You have {inbox!.filter((data) => !data.isRead).length} unread messages
                </Typography>
            )}
            <Box sx={{ marginTop: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "16px",
                        width: "100%",
                        borderRadius: "30px",
                    }}
                >
                    <TextField
                        placeholder="Search..."
                        sx={{ borderRadius: "16px" }}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment sx={{ borderRadius: "50px" }} position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <TableHead sx={{ display: "flex", justifyContent: "left", alignItems: "center", marginBottom: "10px" }}>
                    <IconButton
                        sx={{ color: selectedRows.size ? "red" : "" }}
                        onClick={() => setDeleteModal(true)}
                        disabled={selectedRows.size === 0}
                    >
                        <DeleteRounded />
                    </IconButton>
                    <Typography variant="h6">{selectedRows.size ? `${selectedRows.size} selected` : ""}</Typography>
                </TableHead>

                <TableContainer sx={{ minHeight: "67vh" }} component={Paper}>
                    <Table stickyHeader sx={{ minWidth: 500 }}>
                        <TableBody sx={{ minHeight: "67vh" }}>
                            {paginatedData.length === 0
                                ? `your ${isInbox ? "inbox" : "sent emails section"} is empty`
                                : paginatedData.map((item, index) => (
                                      <TableRow
                                          key={index + ""}
                                          sx={{
                                              border: 0,

                                              bgcolor: selectedRows.has(index)
                                                  ? "rgba(128, 128, 128, 0.233)"
                                                  : !isInbox
                                                  ? ""
                                                  : item.isRead
                                                  ? ""
                                                  : "rgb(223, 231, 245, 0.5)",
                                              height: "10px",
                                          }}
                                          onClick={(event) => {
                                            console.log("in row");
                                            event.stopPropagation();
                                            return handleRowClick(item.id);
                                        }}
                                        
                                      >
                                          <TableCell padding="checkbox">
                                              <Checkbox
                                                  checked={selectedRows.has(index)}
                                                  onClick={(event) => {
                            
                                                      event.stopPropagation()
                                                    
                                                      handleRowSelection(index);
                                                  }}
                                              />
                                          </TableCell>
                                          {Object.entries(item).map(([k, v], idx) => {
                                              const displayValue =
                                                  k === "addressee" && isInbox
                                                      ? `from: ${v.emailAddress}`
                                                      : k === "addressee" && !isInbox
                                                      ? ""
                                                      : k === "addressed" && isInbox
                                                      ? ""
                                                      : k === "addressed" && !isInbox
                                                      ? `to: ${v.emailAddress}`
                                                      : k === "title"
                                                      ? `topic: "${v}"`
                                                      : k === "isRead" ||
                                                        k === "id" ||
                                                        k === "text" ||
                                                        k === "addressedVisible" ||
                                                        k === "addresseeVisible"
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
                    </Table>
                </TableContainer>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[]}
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Box>
            {deleteModal && (
                <DeleteModal
                    itemsCount={selectedRows.size}
                    setDeleteModal={setDeleteModal}
                    handleDelete={handleDeleteSelected}
                    isInbox={isInbox}
                />
            )}
        </div>
    );
};

export default TableData;
