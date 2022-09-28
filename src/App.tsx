import { CssBaseline } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { ProviderContext } from "notistack";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChangePassword } from "./routes/ChangePassword";
import { EsportsCapsuleFarmer } from "./routes/EsportsCapsuleFarmer";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { PageNotFound } from "./routes/PageNotFound";
import { Profile } from "./routes/Profile";
import { Register } from "./routes/Register";
import { Reset } from "./routes/Reset";
import { Verify } from "./routes/Verify";

interface User {
    email: string;
    avatar: string;
}

export const UserContext = React.createContext({
    user: {} as User,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setUser: (user: User) => {},
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#fdd835",
        },
        secondary: {
            main: "#1565c0",
        },
    },
});

function App() {
    const [user, setUser] = React.useState({} as User);

    return (
        <ThemeProvider theme={darkTheme}>
            <UserContext.Provider value={{ user, setUser }}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="register/:token" element={<Verify />} />
                        <Route path="reset" element={<Reset />} />
                        <Route path="reset/:token" element={<ChangePassword />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="ecf" element={<EsportsCapsuleFarmer />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </ThemeProvider>
    );
}

export default App;

export async function showResponse(
    response: Response,
    enqueueSnackbar: ProviderContext["enqueueSnackbar"],
    closeSnackbar: ProviderContext["closeSnackbar"]
) {
    const json = await response.json();
    if (~~(response.status / 100) === 1) {
        enqueueSnackbar(json.message, { variant: "info" });
    } else if (~~(response.status / 100) === 2) {
        enqueueSnackbar(json.message, { variant: "success" });
    } else if (~~(response.status / 100) === 3) {
        enqueueSnackbar(json.message, { variant: "default" });
    } else if (~~(response.status / 100) === 4) {
        enqueueSnackbar(json.message, { variant: "error" });
    } else if (~~(response.status / 100) === 5) {
        enqueueSnackbar(json.message, { variant: "warning" });
    }
}
