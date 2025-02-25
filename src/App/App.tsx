import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../Components/NavBar";
import Admin from "../Pages/Admin/Admin";
import Cart from "../Pages/Cart/Cart";
import theme from "../theme";
import "./styles.css";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
               
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Cart />} />
                        <Route path="/sent" element={<Admin />} />
                    </Routes>
                </div>
            </Router>
            <ToastContainer position="bottom-left" />
        </ThemeProvider>
    );
}

export default App;
