import { AlertColor, CssBaseline } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { ProviderContext, SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarAlert } from "./components/SnackbarAlert";
import { ChangePassword } from "./routes/ChangePassword";
import { Clock } from "./routes/Clock";
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
            <SnackbarProvider
                maxSnack={3}
                Components={{
                    alert: SnackbarAlert,
                }}
            >
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
                            <Route path="clock" element={<Clock />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </BrowserRouter>
                </UserContext.Provider>
            </SnackbarProvider>
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
    switch (~~(response.status / 100)) {
        case 1:
        case 3:
            enqueueSnackbar(json.message, {
                variant: "alert",
                severity: "info",
            });
            break;
        case 2:
            enqueueSnackbar(json.message, {
                variant: "alert",
                severity: "success",
            });
            break;
        default:
        case 4:
            enqueueSnackbar(json.message, {
                variant: "alert",
                severity: "error",
            });
            break;
        case 5:
            enqueueSnackbar(json.message, {
                variant: "alert",
                severity: "warning",
            });
            break;
    }
}

declare module "notistack" {
    interface VariantOverrides {
        alert: { severity: AlertColor };
    }
}
