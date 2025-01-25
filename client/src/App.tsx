import { CssBaseline, PaletteMode } from "@mui/material";
import { enUS, zhCN } from "@mui/material/locale";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { SnackbarKey, SnackbarProvider } from "notistack";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarAlert } from "./components/SnackbarAlert";
import routes from "./routes";

export const snackbars: SnackbarKey[] = [];

type Context = {
    loading: [number, React.Dispatch<React.SetStateAction<number>>];
    mode: [PaletteMode, React.Dispatch<React.SetStateAction<PaletteMode>>];
    user: [User, React.Dispatch<React.SetStateAction<User>>];
};

export type User = {
    email: string;
} | null;

export const Context = React.createContext<Context>({
    loading: [0, () => void 0],
    mode: ["dark", () => void 0],
    user: [null, () => void 0],
});

function App() {
    const [loading, setLoading] = React.useState(0);
    const [mode, setMode] = React.useState<PaletteMode>("dark");
    const [user, setUser] = React.useState<User>(null);

    const { i18n } = useTranslation();

    React.useEffect(() => {
        // set the mode based on user's system preference by default
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => {
            setMode(event.matches ? "dark" : "light");
        };
        mediaQuery.addEventListener("change", handleChange);
        setMode(mediaQuery.matches ? "dark" : "light");
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const theme = React.useMemo(
        () =>
            createTheme(
                {
                    cssVariables: true,
                    palette: {
                        mode: mode,
                        primary: {
                            main: mode === "light" ? "#0078d4" : "#fdd835",
                        },
                        secondary: {
                            main: "#fdd835",
                        },
                    },
                },
                getLocale(i18n.language)
            ),
        [i18n.language, mode]
    );

    return (
        <Context.Provider value={{ loading: [loading, setLoading], mode: [mode, setMode], user: [user, setUser] }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider
                    Components={{
                        alert: SnackbarAlert,
                    }}
                    transitionDuration={{ enter: 50, exit: 150 }}
                >
                    <BrowserRouter>
                        <Routes>
                            {routes.map((route, index) => {
                                const Component = route.element;
                                return <Route key={index} path={route.path} element={<Component />} />;
                            })}
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
