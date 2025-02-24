import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Navbar from "./Components/NavBar";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import Admin from "./Pages/Admin/Admin";
import Cart from "./Pages/Cart/Cart";
import Home from "./Pages/Home/Home";
import theme from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./store/store";

const queryClient = new QueryClient();

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/admin" element={<Admin />} />
                        </Routes>
                    </Router>
                    <ToastContainer position="bottom-left" />
                </ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
