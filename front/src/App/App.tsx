import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../Components/NavBar";
import Admin from "../Pages/Admin/Admin";
import Cart from "../Pages/Cart/Cart";
import theme from "../theme";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Email from "../Pages/Email/Email";
import DeleteModal from "../Components/modals/DeleteModal";
import Login from "../Pages/Login/Admin";
import Signup from "../Pages/Signup/Admin";

const queryClient = new QueryClient();

function Layout() {
    const location = useLocation(); // ✅ Now inside Router!

    return (
        <>
            {/* Show Navbar only if not on the login page */}
            {location.pathname !== "/login" && location.pathname !== "/signup" && <Navbar />}
            <div className="content">
                <Routes>
                    <Route path="/" element={<Cart />} />
                    <Route path="/sent" element={<Admin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/:emailId" element={<Email />} />
                    <Route path="/sent/:emailId" element={<Email />} />
                </Routes>
            </div>
        </>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <Layout />  {/* ✅ Now inside Router */}
                </Router>
                <ToastContainer position="bottom-left" />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
