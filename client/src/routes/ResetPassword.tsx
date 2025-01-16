import Send from "@mui/icons-material/Send";
import { Backdrop, Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import AuthLayout from "../components/AuthLayout";
import PlaceholderLayout from "../components/PlaceholderLayout";
import { getRequest, postRequest } from "../components/Request";
import "./ResetPassword.scss";

function ResetPassword() {
    const [componentToRender, setComponentToRender] = React.useState(<PlaceholderLayout />);
    const navigate = useNavigate();

    React.useMemo(() => {
        getRequest("/auth").then(async (response) => {
            if (response.ok) navigate("/", { replace: true });
            else setComponentToRender(<ResetPasswordComponent />);
        });
    }, []);

    function ResetPasswordComponent() {
        const context = React.useContext(Context);
        const [loading, setLoading] = React.useState(false);

        const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLoading(true);
            context.loading[1]((prev) => prev + 1);

            const data = new FormData(event.currentTarget);
            const json = {
                email: data.get("email"),
            };

            postRequest("/auth/reset", json).then((response) => {
                context.loading[1]((prev) => prev - 1);
                setLoading(false);
                if (response.ok) setComponentToRender(<ResetPasswordEmail />);
            });
        };

        return (
            <AuthLayout name="Reset password">
                <Box className="reset-password-container" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        className="reset-password-text-field"
                        disabled={loading}
                        id="email"
                        label="Email Address"
                        margin="normal"
                        name="email"
                        required
                    />
                    <Button
                        className="reset-password-button"
                        disabled={loading}
                        startIcon={<Send />}
                        sx={{ mt: 3, mb: 2 }}
                        type="submit"
                        variant="contained"
                    >
                        Send email
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                                Back
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                Don&apos;t have an account? Register
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

export function ResetPasswordEmail() {
    return (
        <AuthLayout name="Reset password">
            <Box className="reset-password-email-container">
                <Typography className="reset-password-email-text">
                    Please check your email for a reset password link.
                </Typography>
            </Box>
        </AuthLayout>
    );
}

export default ResetPassword;
