import { SxProps } from "@mui/material";

export const modalContainerStyle: SxProps = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
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
export const modalButtonStyle: SxProps = {
    backgroundColor: "white",
    fontWeight: "800",
};
