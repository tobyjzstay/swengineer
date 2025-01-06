import { CssBaseline, PaletteMode } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import React from "react";
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

    const darkTheme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode: mode,
                    primary: {
                        main: "#fdd835",
                    },
                },
            }),
        [mode]
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

export default App;
