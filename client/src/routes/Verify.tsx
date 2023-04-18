import { Box, CircularProgress, Container } from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { getRequest } from "../components/Request";
import { PageNotFoundContent } from "./PageNotFound";

export function Verify() {
    const navigate = useNavigate();
    const token = useParams().token;

    const [componentToRender, setComponentToRender] = React.useState(<CircularProgress />);

    React.useEffect(() => {
        getRequest(`/register/${token}`).then((response) => {
            if (response.status === 200) {
                navigate("/login");
            } else {
                setComponentToRender(<PageNotFoundContent />);
            }
        });
    }, []);

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box sx={{ m: 3 }}>
                    <Logo />
                </Box>
                {componentToRender}
            </Box>
        </Container>
    );
}
