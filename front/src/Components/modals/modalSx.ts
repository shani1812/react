import { SxProps } from "@mui/material";

export const delteModalContainerStyle: SxProps = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "rgb(234, 239, 248)",
    boxShadow: 50,
    width: "25vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "min(2em, 3vw)",
    p: 4,
    minHeight: "25vh",
    "@media (max-width: 600px)": {
        width: "80vw",
    },
};
export const deleteModalButtonStyle: SxProps = {
    backgroundColor: "white",
    fontWeight: "800",
};
