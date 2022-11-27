import { Box, Button, CircularProgress, Container, Grid, Link, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { showResponse } from "../App";
import { Logo } from "../components/Logo";

export function Register() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

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

        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        }).then((response) => {
            const success = response.status === 200;
            setSubmitted(success);
            setResponded(success);
            showResponse(response, enqueueSnackbar, closeSnackbar);
        });
    };

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
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                    <TextField
                        disabled={submitted}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        disabled={submitted}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                    <Button disabled={submitted} fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
                        {submitted ? (
                            responded ? (
                                "Verification email sent"
                            ) : (
                                <CircularProgress size={24.5} />
                            )
                        ) : (
                            "Send email"
                        )}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/reset" variant="body2">
                                {"Forgot password?"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Already have an account? Log in"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
