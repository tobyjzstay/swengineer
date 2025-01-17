import Send from "@mui/icons-material/Send";
import { Backdrop, Box, Button, Grid2 as Grid, Link, TextField, Typography } from "@mui/material";
import { t } from "i18next";
import * as React from "react";
import { Trans } from "react-i18next";
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
            <AuthLayout name={t("register.title")}>
                <Box className="register-container" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        className="register-text-field"
                        disabled={loading}
                        id="email"
                        label={<Trans i18nKey="register.emailAddress" />}
                        margin="normal"
                        name="email"
                        required
                    />
                    <TextField
                        autoComplete="new-password"
                        className="register-text-field"
                        disabled={loading}
                        id="password"
                        label={<Trans i18nKey="register.password" />}
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
                        <Trans i18nKey="register.sendEmail" />
                    </Button>
                    <Grid size="grow">
                        <Grid size="auto">
                            <Link href="/reset" variant="body2">
                                <Trans i18nKey="register.forgotPassword" />
                            </Link>
                        </Grid>
                        <Grid>
                            <Link href="/login" variant="body2">
                                <Trans i18nKey="register.logIn" />
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
                    <Trans i18nKey="register.verificationEmail" />
                </Typography>
                <Button
                    className="verification-email-button"
                    disabled={loading}
                    startIcon={<Send />}
                    type="submit"
                    variant="contained"
                >
                    <Trans i18nKey="register.resendEmail" />
                </Button>
            </Box>
        </AuthLayout>
    );
}

export default Register;
