import GitHub from "@mui/icons-material/GitHub";
import { Box, IconButton, Link, Toolbar, Typography } from "@mui/material";
import { version } from "..";
import "./Footer.scss";

function Footer() {
    const [core, , build] = version.split(/[-+]/);

    return (
        <Box className="footer-layout" component="footer">
            <Toolbar variant="dense">
                <Box className="footer-start">
                    <Typography variant="caption"></Typography>
                    <Link
                        href={`https://github.com/tobyjzstay/swengineer/releases/tags/v${core}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        variant="caption"
                    >
                        v{core}
                    </Link>
                    <Link
                        href={`https://github.com/tobyjzstay/swengineer/commit/${build}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        variant="caption"
                    >
                        {build}
                    </Link>
                </Box>
                <Box className="footer-end">
                    <IconButton
                        component="a"
                        href="https://github.com/tobyjzstay/swengineer"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <GitHub />
                    </IconButton>
                </Box>
            </Toolbar>
        </Box>
    );
}

export default Footer;
