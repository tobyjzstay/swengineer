import { Box } from "@mui/material";
import { Logo } from "../components/Logo";

export function Home() {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Logo />
        </Box>
    );
}
