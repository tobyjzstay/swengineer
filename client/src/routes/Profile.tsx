import Delete from "@mui/icons-material/Delete";
import { Backdrop, Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../App";
import Layout, { LayoutType } from "../components/Layout";
import { getRequest, postRequest } from "../components/Request";
import "./Profile.scss";

function Profile() {
    const context = React.useContext(Context);

    const [initialised, setInitialised] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const disabled = !initialised && loading;
    const [value, setValue] = React.useState("");

    const navigate = useNavigate();

    React.useMemo(() => {
        const pathname = window.location.pathname;
        getRequest(pathname).then(async (response) => {
            if (!response.ok) navigate("/login?redirect=" + pathname, { replace: true });
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

        postRequest("/auth/delete", {}).then(async (response) => {
            setLoading(false);
            if (response.ok) {
                postRequest("/auth/logout", {}).then(() => {
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
