import * as React from "react";

import { Box, Button, Container, Grid, Link, TextField, Typography } from "@mui/material";

export default function SignIn() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
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
        }).then((response) => {
            console.log(response);
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
                <Link href="/" style={{ textDecoration: "none" }}>
                    <Box display="flex" flexDirection="row" alignItems="center" sx={{ m: 3 }}>
                        <img
                            src={process.env.PUBLIC_URL + "logo.svg"}
                            alt="swengineer"
                            width={64}
                            style={{ padding: 10 }}
                        />
                        <Typography component="h1" variant="h4" color="white">
                            swengineer
                        </Typography>
                    </Box>
                </Link>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                    <TextField
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
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Log in
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
                </Box>
            </Box>
        </Container>
    );
}
