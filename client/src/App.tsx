import { CssBaseline } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { SnackbarKey, SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarAlert } from "./components/SnackbarAlert";
import ChangePassword from "./routes/ChangePassword";
import Clock from "./routes/Clock";
import { Draw } from "./routes/Draw";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Music from "./routes/Music";
import { Notepad } from "./routes/Notepad";
import PageNotFound from "./routes/PageNotFound";
import Profile from "./routes/Profile";
import Register from "./routes/Register";
import ResetPassword from "./routes/ResetPassword";
import Verify from "./routes/Verify";

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
        secondary: {
            main: "##536ee4",
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
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Register />} />
                                <Route path="register/:token" element={<Verify />} />
                                <Route path="reset" element={<ResetPassword />} />
                                <Route path="reset/:token" element={<ChangePassword />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="clock" element={<Clock />} />
                                <Route path="draw" element={<Draw />} />
                                <Route path="notepad" element={<Notepad />} />
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
