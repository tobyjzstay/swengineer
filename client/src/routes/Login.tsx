import { Box, Button, CircularProgress, Container, Grid, Link, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { showResponse } from "../App";
import { Logo } from "../components/Logo";

export function Login() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [submitted, setSubmitted] = React.useState(false);
    const [responded, setResponded] = React.useState(false);

    React.useEffect(() => {
        fetch(`/api/auth`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(async (response) => {
            const json = await response.json();
            const { user } = json;
            if (user) navigate("/", { replace: true });
        });
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        const data = new FormData(event.currentTarget);
        const json = {
            email: data.get("email"),
            password: data.get("password"),
        };
        fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(json),
        }).then(async (response) => {
            const success = response.status === 200;
            setSubmitted(success);
            setResponded(success);
            if (success) navigate("/");
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
                    Log in
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
                        autoComplete="current-password"
                    />
                    <Button disabled={submitted} fullWidth sx={{ mt: 3, mb: 2 }} type="submit" variant="contained">
                        {submitted && !responded ? <CircularProgress size={24.5} /> : "Log in"}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/reset" variant="body2">
                                {"Forgot password?"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Register"}
                            </Link>
                        </Grid>
                    </Grid>
                    <Button
                        disabled={submitted}
                        fullWidth
                        sx={{ mt: 3, mb: 2 }}
                        variant="contained"
                        color="secondary"
                        href="api/auth/google"
                    >
                        {submitted && !responded ? <CircularProgress size={24.5} /> : "Log in with Google"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
