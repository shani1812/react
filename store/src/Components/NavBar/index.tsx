import { AppBar, Box, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Link as LinkType } from "../../types";
import "./styles.css";

const pages: LinkType[] = [
    {
        label: "Home",
        path: "",
    },
    {
        label: "Cart",
        path: "cart",
    },
    {
        label: "Admin",
        path: "admin",
    },
];

const Navbar = () => {
    return (
        <>
            <Box className="nav">
                <AppBar color="transparent" position="static">
                    <Toolbar sx={{ padding: 0 }}>
                        <Box className="link-box">
                            {pages.map(({ label, path }) => (
                                <NavLink className={({ isActive }) => (isActive ? "link active" : "link")} to={path}>
                                    {label}
                                </NavLink>
                            ))}
                        </Box>

                        <header className="nav-title">SuperMarket Shani</header>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
};

export default Navbar;
