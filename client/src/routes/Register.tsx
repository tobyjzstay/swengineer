import Send from "@mui/icons-material/Send";
import { Backdrop, Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import AuthLayout from "../components/AuthLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest, useQuery } from "../components/Request";
import "./Register.scss";

function Register() {
    const navigate = useNavigate();
    const query = useQuery();
    const redirect = query.get("redirect") || "/";

    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);

    React.useMemo(() => {
        getRequest("/auth", true).then(async (response) => {
            if (response.ok) navigate(redirect, { replace: true });
            else setComponentToRender(<RegisterComponent />);
        });
    }, [navigate, redirect]);

    function RegisterComponent() {
        const context = React.useContext(Context);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            context.loading[1]((prev) => prev + 1);

            const data = new FormData(event.currentTarget);
            const email = data.get("email")?.toString();
            const json = {
                email: data.get("email"),
                password: data.get("password"),
            };

            postRequest("/auth/register", json).then((response) => {
                context.loading[1]((prev) => prev - 1);
                setLoading(false);
                if (email && (response.ok || response.status === 409))
                    setComponentToRender(<VerificationEmail email={email} />);
            });
        };

        return (
            <AuthLayout name={"Register"}>
                <Box className="register-container" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        className="register-text-field"
                        disabled={loading}
                        id="email"
                        label="Email Address"
                        margin="normal"
                        name="email"
                        required
                    />
                    <TextField
                        autoComplete="new-password"
                        className="register-text-field"
                        disabled={loading}
                        id="password"
                        label="Password"
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <Button
                        className="register-button"
                        disabled={loading}
                        startIcon={<Send />}
                        type="submit"
                        variant="contained"
                    >
                        Send email
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
                    <Backdrop open={loading} />
                </Box>
            </AuthLayout>
        );
    }

    return componentToRender;
}

function VerificationEmail({ email }: { email: string }) {
    const context = React.useContext(Context);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        context.loading[1]((prev) => prev + 1);

        const json = {
            email: email,
            verify: true,
        };

        postRequest("/auth/register", json).then(() => {
            context.loading[1]((prev) => prev - 1);
            setLoading(false);
        });
    };

    return (
        <AuthLayout name="Register">
            <Box className="verification-email-container" component="form" noValidate onSubmit={handleSubmit}>
                <Typography className="verification-email-text">
                    Please check your email for a verification link.
                </Typography>
                <Button
                    className="verification-email-button"
                    disabled={loading}
                    startIcon={<Send />}
                    type="submit"
                    variant="contained"
                >
                    Resend email
                </Button>
            </Box>
        </AuthLayout>
    );
}

export default Register;
