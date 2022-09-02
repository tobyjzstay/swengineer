import { CssBaseline } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import PageNotFound from "./routes/PageNotFound";
import Register from "./routes/Register";
import Reset from "./routes/Reset";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#fdd835",
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="reset" element={<Reset />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
