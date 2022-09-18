import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    FormControlLabel,
    TextField,
    Typography
} from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { showResponse } from "../App";
import { Appbar } from "../components/Appbar";

export function EsportsCapsuleFarmer() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [submitted, setSubmitted] = React.useState(false);
    const [responded, setResponded] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        const data = new FormData(event.currentTarget);
        const json = {
            email: data.get("email"),
            password: data.get("password"),
        };
        fetch("/api/ecf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        }).then(async (response) => {
            const success = response.status === 200;
            setSubmitted(success);
            setResponded(success);
            showResponse(response, enqueueSnackbar, closeSnackbar);
        });
    };

    return (
        <>
            <Appbar />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Esports Capsule Farmer
                    </Typography>
                    <Typography textAlign="left">You can choose to </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                        <TextField
                            disabled={submitted}
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="LoL Esports Username"
                            name="username"
                            autoFocus
                        />
                        <TextField
                            disabled={submitted}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="LoL Esports Password"
                            type="password"
                            id="password"
                        />
                         <Typography textAlign="left">This project is NOT affiliated with, funded, or in any way associated with Riot Games</Typography>
                        <FormControlLabel control={<Checkbox defaultChecked />} label="Store my login details and relog me when my session expires." />
                        <Button disabled={submitted} fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
                            {submitted ? (
                                responded ? (
                                    "Verification email sent"
                                ) : (
                                    <CircularProgress size={24.5} />
                                )
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
