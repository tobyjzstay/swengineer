import { CssBaseline, PaletteMode } from "@mui/material";
import { enUS, zhCN } from "@mui/material/locale";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/Home";

type Context = {
    mode: [PaletteMode, React.Dispatch<React.SetStateAction<PaletteMode>>];
};

export const Context = React.createContext<Context>({
    mode: ["light", () => void 0],
});

function App() {
    const [mode, setMode] = React.useState<PaletteMode>("dark");

    const { i18n } = useTranslation();

    const darkTheme = React.useMemo(
        () =>
            createTheme(
                {
                    palette: {
                        mode: mode,
                        primary: {
                            main: "#fdd835",
                        },
                    },
                },
                getLocale(i18n.language)
            ),
        [i18n.language, mode]
    );

    return (
        <Context.Provider value={{ mode: [mode, setMode] }}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route index path="*" element={<Home />} />
                    </Routes>
                </BrowserRouter>
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
