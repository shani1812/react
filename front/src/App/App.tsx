import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../Components/NavBar";
import Sent from "../Pages/Sent";
import Inbox from "../Pages/Inbox";
import theme from "../theme";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Email from "../Pages/Email";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";

const queryClient = new QueryClient();

function Layout() {
    const location = useLocation(); 

    return (
        <>
            {location.pathname !== "/login" && location.pathname !== "/signup" && <Navbar />}
            <div className="content">
                <Routes>
                    <Route path="/" element={<Inbox />} />
                    <Route path="/sent" element={<Sent />} />
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
                    <Layout />
                </Router>
                <ToastContainer position="bottom-left" />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
