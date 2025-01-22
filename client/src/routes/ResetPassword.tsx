import Send from "@mui/icons-material/Send";
import { Backdrop, Box, Button, Grid2 as Grid, Link, TextField, Typography } from "@mui/material";
import { t } from "i18next";
import * as React from "react";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
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
            <Layout layoutType={LayoutType.Auth} name={t("resetPassword.title")}>
                <Box className="reset-password-container" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        className="reset-password-text-field"
                        disabled={loading}
                        id="email"
                        label={<Trans i18nKey="resetPassword.emailAddress" />}
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
                        <Trans i18nKey="resetPassword.sendEmail" />
                    </Button>
                    <Grid container>
                        <Grid size="grow">
                            <Link href="/login" variant="body2">
                                <Trans i18nKey="resetPassword.back" />
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href="/register" variant="body2">
                                <Trans i18nKey="resetPassword.register" />
                            </Link>
                        </Grid>
                    </Grid>
                    <Backdrop open={loading} />
                </Box>
            </Layout>
        );
    }

    return componentToRender;
}

export function ResetPasswordEmail() {
    return (
        <Layout layoutType={LayoutType.Auth} name="Reset password">
            <Box className="reset-password-email-container">
                <Typography className="reset-password-email-text">
                    Please check your email for a reset password link.
                </Typography>
            </Box>
        </Layout>
    );
}

export default ResetPassword;
