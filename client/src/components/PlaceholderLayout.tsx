import { Box } from "@mui/material";
import Footer from "./Footer";

function PlaceholderLayout() {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
            }}
        >
            <Footer />
        </Box>
    );
}

export default PlaceholderLayout;
