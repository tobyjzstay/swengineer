import { CssBaseline } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { SnackbarKey, SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarAlert } from "./components/SnackbarAlert";
import { ChangePassword } from "./routes/ChangePassword";
import { Clock } from "./routes/Clock";
import { Draw } from "./routes/Draw";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { Music } from "./routes/Music";
import { Notepad } from "./routes/Notepad";
import { PageNotFound } from "./routes/PageNotFound";
import { Profile } from "./routes/Profile";
import { Register } from "./routes/Register";
import { Reset } from "./routes/Reset";
import { Verify } from "./routes/Verify";

export const snackbars: SnackbarKey[] = [];

interface User {
    id: string;
    email: string;
    created: string;
}

export const UserContext = React.createContext<[User, React.Dispatch<React.SetStateAction<User>>]>([
    Object.create(null),
    () => undefined,
]);

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
    const user = React.useState(Object.create(null));

    return (
        <ThemeProvider theme={darkTheme}>
            <SnackbarProvider
                Components={{
                    alert: SnackbarAlert,
                }}
                transitionDuration={{ enter: 50, exit: 150 }}
            >
                <UserContext.Provider value={user}>
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
                            <Route path="draw" element={<Draw />} />
                            <Route path="notepad" element={<Notepad />} />
                            <Route path="music" element={<Music />} />
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </BrowserRouter>
                </UserContext.Provider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;

// export async function showResponse(
//     response: Response,
//     enqueueSnackbar: ProviderContext["enqueueSnackbar"],
//     closeSnackbar: ProviderContext["closeSnackbar"],
//     navigate?: NavigateFunction
// ) {
//     const json = await response.json();
//     let severity: AlertColor = "info";
//     // if (navigate && json?.redirect) navigate(json.redirect, { replace: true });
//     switch (~~(response.status / 100)) {
//         default:
//         case 1:
//             severity = "info";
//             break;
//         case 2:
//             severity = "success";
//             break;
//         case 3:
//             severity = "info";
//             break;
//         case 4:
//             severity = "error";
//             break;
//         case 5:
//             severity = "warning";
//             break;
//     }

//     snackbars.push(
//         enqueueSnackbar(isJsonString(json) ? json.message : json, {
//             variant: "alert",
//             severity: severity,
//             status: response.status,
//             statusText: response.statusText,
//         })
//     );

//     snackbars.length > 3 && closeSnackbar(snackbars.shift());
//     return json;
// }

// declare module "notistack" {
//     interface VariantOverrides {
//         alert: { severity: AlertColor; status: number; statusText: string };
//     }
// }

function isJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
