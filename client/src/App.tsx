import { CssBaseline, PaletteMode } from "@mui/material";
import { enUS, zhCN } from "@mui/material/locale";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { SnackbarKey, SnackbarProvider } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarAlert } from "./components/SnackbarAlert";
import ChangePassword from "./routes/ChangePassword";
import Clock from "./routes/Clock";
import Home from "./routes/Home";
import Login from "./routes/Login";
import PageNotFound from "./routes/PageNotFound";
import Profile from "./routes/Profile";
import Register from "./routes/Register";
import ResetPassword from "./routes/ResetPassword";
import Verify from "./routes/Verify";

export const snackbars: SnackbarKey[] = [];

type Context = {
    loading: [number, React.Dispatch<React.SetStateAction<number>>];
    mode: [PaletteMode, React.Dispatch<React.SetStateAction<PaletteMode>>];
    user: [User, React.Dispatch<React.SetStateAction<User>>];
};

export type User = {
    id: string;
    email: string;
    created: string;
} | null;

export const Context = React.createContext<Context>({
    loading: [0, () => void 0],
    mode: ["light", () => void 0],
    user: [null, () => void 0],
});

function App() {
    const [loading, setLoading] = React.useState(0);
    const [mode, setMode] = React.useState<PaletteMode>("dark");
    const [user, setUser] = React.useState<User>(null);

    const { i18n } = useTranslation();

    const darkTheme = React.useMemo(
        () =>
            createTheme(
                {
                    cssVariables: true,
                    palette: {
                        mode: mode,
                        primary: {
                            main: "#fdd835",
                        },
                        secondary: {
                            main: "#0078d4",
                        },
                    },
                },
                getLocale(i18n.language)
            ),
        [i18n.language, mode]
    );

    return (
        <Context.Provider value={{ loading: [loading, setLoading], mode: [mode, setMode], user: [user, setUser] }}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <SnackbarProvider
                    Components={{
                        alert: SnackbarAlert,
                    }}
                    transitionDuration={{ enter: 50, exit: 150 }}
                >
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
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </BrowserRouter>
                </SnackbarProvider>
            </ThemeProvider>
        </Context.Provider>
    );
}

function getLocale(language: string) {
    switch (language) {
        case "en-AU":
        case "en-GB":
        case "en-NZ":
        case "en-US":
        case "en":
        case "mi-NZ":
        default:
            return enUS;
        case "zh-CN":
        case "zh":
            return zhCN;
    }
}

export default App;
