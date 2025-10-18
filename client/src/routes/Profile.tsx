import Delete from "@mui/icons-material/Delete";
import { Backdrop, Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
import { postRequest } from "../components/Request";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import "./Profile.scss";

function Profile() {
    const context = React.useContext(Context);

    const [initialised, setInitialised] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const disabled = !initialised && loading;
    const [value, setValue] = React.useState("");

    const pathname = window.location.pathname;
    useAuthRedirect(setInitialised, "/login?redirect=" + pathname);

    const navigate = useNavigate();

    React.useEffect(() => {
        // update local loading state with global loading state
        if (loading) context.loading[1]((prev) => prev + 1);
        else context.loading[1]((prev) => prev - 1);
    }, [loading]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        postRequest("/auth/delete", { credentials: "include" }).then(async (response) => {
            setLoading(false);
            if (response.ok) {
                postRequest("/auth/logout", { credentials: "include" }).then(() => {
                    navigate("/");
                });
            }
        });
    };

    return (
        <Layout initialised={initialised} layoutType={LayoutType.Auth} name="Profile">
            <Box className="profile-container" component="form" noValidate onSubmit={handleSubmit}>
                <Typography>
                    To confirm your account deletion, enter your email associated with your account.
                </Typography>
                <TextField
                    className="profile-text-field"
                    disabled={disabled}
                    id="email"
                    label="Email Address"
                    margin="normal"
                    name="email"
                    onChange={(event) => {
                        setValue(event.target.value);
                    }}
                    required
                    value={value}
                />
                <Button
                    className="profile-button"
                    color="error"
                    disabled={disabled || value !== context.user[0]?.email}
                    startIcon={<Delete />}
                    type="submit"
                    variant="contained"
                >
                    Delete account
                </Button>
                <Backdrop open={loading} />
            </Box>
        </Layout>
    );
}

export default Profile;
