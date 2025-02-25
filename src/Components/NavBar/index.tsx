import { AppBar, Box, Toolbar, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Link as LinkType } from "../../types";
import { useState } from "react";
import "./styles.css";
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';

const pages: LinkType[] = [
    {
        label: "Inbox",
        path: "",
        icon: <EmailIcon />
    },
    {
        label: "Sent",
        path: "sent",
        icon: <SendIcon />
    }
];

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Box className={`nav ${isCollapsed ? "collapsed" : ""}`}>
            <AppBar
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,  
                    height: "100%",  
                    width: isCollapsed ? "50px" : "250px", 
                    backgroundColor: "#f8fafd",  
                    transition: "width 0.3s ease",  
                }}
            >
                <Toolbar sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: 0 }}>
                    <IconButton 
                        sx={{ 
                            position: 'absolute', 
                            top: 20, 
                            left: 0, 
                           
                        }}
                        onClick={toggleNavbar}
                    >
                        <MenuIcon sx={{ color: "black" }} />
                    </IconButton>

                    {/* Title at the top of the sidebar */}
                    {!isCollapsed && <header className="nav-title">ShaniMail</header>}

                    <Box className="link-box" sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "10%" }}>
                        {pages.map(({ label, path, icon }) => (
                            <NavLink
                                key={label+""}
                                className={({ isActive }) => (isActive ? "link active" : "link")}
                                to={path}
                            >
                                {icon}
                                {!isCollapsed && label}
                            </NavLink>
                        ))}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
