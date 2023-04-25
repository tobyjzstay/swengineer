import { Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import Header from "../components/Header";
import { postRequest } from "../components/Request";

export function Profile() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [submitted, setSubmitted] = React.useState(false);
    const [responded, setResponded] = React.useState(false);
    const [value, setValue] = React.useState("");

    const user = React.useContext(AppContext)?.user;

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);

        const data = new FormData(event.currentTarget);
        const json = {
            email: data.get("email"),
            password: data.get("password"),
        };
        postRequest("/delete", json).then(async (response) => {
            const success = response.status === 200;
            setSubmitted(success);
            setResponded(success);
            if (success) navigate("/");
        });
    };
    return (
        <>
            <Header />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                        Profile
                    </Typography>
                    <Typography>
                        To confirm your account deletion, enter your email associated with your account.
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
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                        <Button
                            disabled={submitted || value !== user?.email}
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                            type="submit"
                            variant="contained"
                            color="error"
                        >
                            {submitted && !responded ? <CircularProgress size={24.5} /> : "Delete account"}
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
