import Send from "@mui/icons-material/Send";
import { Box, Button, Grid2 as Grid, Link, TextField, Typography } from "@mui/material";
import { t } from "i18next";
import * as React from "react";
import { Trans } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
import { getRequest, postRequest } from "../components/Request";
import "./Register.scss";

function Register() {
    const context = React.useContext(Context);

    const [initialised, setInitialised] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [componentToRender, setComponentToRender] = React.useState<React.JSX.Element>();
    const disabled = !initialised && loading;

    const navigate = useNavigate();

    React.useMemo(() => {
        if (initialised) return;
        // redirect user if already logged in
        getRequest("/auth", true).then(async (response) => {
            if (response.ok) navigate("/", { replace: true });
            else setInitialised(true);
        });
    }, [navigate]);

    React.useEffect(() => {
        // update local loading state with global loading state
        if (loading) context.loading[1]((prev) => prev + 1);
        else context.loading[1]((prev) => prev - 1);
    }, [loading]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        const data = new FormData(event.currentTarget);
        const email = data.get("email")?.toString();
        const json = {
            email: data.get("email"),
            password: data.get("password"),
        };

        postRequest("/auth/register", json).then((response) => {
            setLoading(false);
            if (email && (response.ok || response.status === 409))
                setComponentToRender(<VerificationEmail email={email} />);
        });
    };

    return (
        componentToRender ?? (
            <Layout initialised={initialised} layoutType={LayoutType.Auth} name={t("register.title")}>
                <Box className="register-container" component="form" noValidate onSubmit={handleSubmit}>
                    <TextField
                        autoComplete="email"
                        autoFocus
                        className="register-text-field"
                        disabled={disabled}
                        id="email"
                        label={<Trans i18nKey="register.emailAddress" />}
                        margin="normal"
                        name="email"
                        required
                    />
                    <TextField
                        autoComplete="new-password"
                        className="register-text-field"
                        disabled={disabled}
                        id="password"
                        label={<Trans i18nKey="register.password" />}
                        margin="normal"
                        name="password"
                        required
                        type="password"
                    />
                    <Button
                        className="register-button"
                        disabled={disabled}
                        startIcon={<Send />}
                        type="submit"
                        variant="contained"
                    >
                        <Trans i18nKey="register.sendEmail" />
                    </Button>
                    <Grid container>
                        <Grid size="grow">
                            <Link component={RouterLink} to="/reset" variant="body2">
                                <Trans i18nKey="register.forgotPassword" />
                            </Link>
                        </Grid>
                        <Grid>
                            <Link component={RouterLink} to="/login" variant="body2">
                                <Trans i18nKey="register.logIn" />
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Layout>
        )
    );
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
        <Layout layoutType={LayoutType.Auth} name="Register">
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
        </Layout>
    );
}

export default Register;
