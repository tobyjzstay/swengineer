import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Grid, Icon, Link, TextField, Typography } from "@mui/material";
import * as React from "react";
import { Context } from "../App";
import AuthLayout from "../components/AuthLayout";
import { postRequest } from "../components/Request";

function ResetPassword() {
    const [componentToRender, setComponentToRender] = React.useState(<ResetPasswordComponent />);

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
                    <LoadingButton
                        className="reset-password-button"
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<Icon>send</Icon>}
                        type="submit"
                        variant="contained"
                    >
                        Send email
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/login" variant="body2">
                                {"Back"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Register"}
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
