import { AppBar, Box, Toolbar, IconButton, Button } from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import { Link as LinkType } from "../../types";
import { useState } from "react";
import "./styles.css";
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import DeleteModal from "../modals/DeleteModal";
import NewEmailModal from "../modals/NewEmailModal";

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
    },
];

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isNewEmailModal, setNewEmailModal] = useState(false);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const location = useLocation();

    return (
        <Box className={`nav ${isCollapsed ? "collapsed" : ""}`}>
            <AppBar
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,  
                    minHeight: "100%",
                    width: isCollapsed ? "50px" : "250px", 
                    backgroundColor: "rgb(223, 231, 245, 0.3)",  
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

                    {!isCollapsed && <header className="nav-title">ShaniMail</header>}

                    <Box className="link-box" sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "10%" }}>
                    <Box onClick={()=> setNewEmailModal(!isNewEmailModal)}
                                className={(isCollapsed ? "link" : "new-email")}
                                
                                
                                
                            >
                                <CreateIcon />
                                {!isCollapsed && "New Email"}
                                </Box>
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
             <NewEmailModal open={isNewEmailModal} handleClose={setNewEmailModal} />
        </Box>
    );
};

export default Navbar;





