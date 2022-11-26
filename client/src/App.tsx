import { AlertColor, CssBaseline } from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { ProviderContext, SnackbarKey, SnackbarProvider } from "notistack";
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

const snackbars: SnackbarKey[] = [];

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
    typography: {
        fontFamily: "Cascadia Mono",
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
                transitionDuration={{ enter: 50, exit: 150 }}
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
            snackbars.push(
                enqueueSnackbar(json?.message ?? "", {
                    variant: "alert",
                    severity: "info",
                    status: response.status,
                    statusText: response.statusText,
                })
            );
            break;
        case 2:
            snackbars.push(
                enqueueSnackbar(json?.message ?? "", {
                    variant: "alert",
                    severity: "success",
                    status: response.status,
                    statusText: response.statusText,
                })
            );
            break;
        default:
        case 4:
            snackbars.push(
                enqueueSnackbar(json?.message ?? "", {
                    variant: "alert",
                    severity: "error",
                    status: response.status,
                    statusText: response.statusText,
                })
            );
            break;
        case 5:
            snackbars.push(
                enqueueSnackbar(json?.message ?? "", {
                    variant: "alert",
                    severity: "warning",
                    status: response.status,
                    statusText: response.statusText,
                })
            );
            break;
    }
    snackbars.length > 3 && closeSnackbar(snackbars.shift());
}

declare module "notistack" {
    interface VariantOverrides {
        alert: { severity: AlertColor; status: number; statusText: string };
    }
}
