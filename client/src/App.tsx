import { CssBaseline } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { SnackbarKey, SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarAlert } from "./components/SnackbarAlert";
import Clock from "./routes/Clock";
import Home from "./routes/Home";
import Music from "./routes/Music";
import PageNotFound from "./routes/PageNotFound";

export const snackbars: SnackbarKey[] = [];

interface User {
    id: string;
    email: string;
    created: string;
}

export const AppContext = React.createContext<App | null>(null);

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#fdd835",
        },
    },
});

class App extends React.Component {
    user: User | null = null;
    loading = 0;

    startLoading() {
        this.loading++;
    }

    stopLoading() {
        this.loading--;
    }

    setUser(user: User) {
        this.user = user;
    }

    render() {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <SnackbarProvider
                    Components={{
                        alert: SnackbarAlert,
                    }}
                    transitionDuration={{ enter: 50, exit: 150 }}
                >
                    <AppContext.Provider value={this}>
                        <BrowserRouter>
                            <Routes>
                                <Route index element={<Home />} />
                                <Route path="clock" element={<Clock />} />
                                <Route path="music" element={<Music />} />
                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </AppContext.Provider>
                </SnackbarProvider>
            </ThemeProvider>
        );
    }
}

export default App;
