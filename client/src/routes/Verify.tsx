import { Box, CircularProgress, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showResponse } from "../App";
import { Logo } from "../components/Logo";
import { PageNotFoundContent } from "./PageNotFound";

export function Verify() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const token = useParams().token;

    const [componentToRender, setComponentToRender] = React.useState(<CircularProgress />);

    React.useEffect(() => {
        fetch(`/api/register/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.status === 200) {
                navigate("/login");
            } else {
                setComponentToRender(<PageNotFoundContent />);
            }
            showResponse(response, enqueueSnackbar, closeSnackbar);
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
