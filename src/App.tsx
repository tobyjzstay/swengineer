import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Login from "./pages/Login";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#fdd835",
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Login />
        </ThemeProvider>
    );
}

export default App;
