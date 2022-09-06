import { Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { PageNotFoundContent } from "./PageNotFound";

export function ChangePassword() {
    const token = useParams().token;

    const [componentToRender, setComponentToRender] = React.useState(<CircularProgress />);

    React.useEffect(() => {
        fetch(`/api/reset/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            if (res.status === 200) {
                setComponentToRender(<NewPassword />);
            } else if (res.status === 401) {
                setComponentToRender(<ResendEmail />);
            } else {
                setComponentToRender(<PageNotFoundContent />);
            }
        });
    }, [token]);

    return <FormContainer>{componentToRender}</FormContainer>;
}

function NewPassword() {
    const token = useParams().token;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const json = {
            password: data.get("password"),
        };
        fetch(`/api/reset/${token}`, {
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
        <>
            <Typography component="h1" variant="h5">
                Reset password
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="New password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    autoFocus
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Change password
                </Button>
            </Box>
        </>
    );
}

function ResendEmail() {
    const token = useParams().token;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const json = {
            token: token,
        };
        fetch("/api/reset", {
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
        <>
            <Typography component="h1" variant="h5">
                Reset password
            </Typography>
            <Typography sx={{ mt: 2 }}>The token has expired. Please request a new one.</Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: "100%" }}>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Resend email
                </Button>
            </Box>
        </>
    );
}

function FormContainer({ children }: { children?: React.ReactNode }) {
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
                <Logo />

                {children}
            </Box>
        </Container>
    );
}
