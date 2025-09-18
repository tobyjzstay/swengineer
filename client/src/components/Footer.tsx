import GitHub from "@mui/icons-material/GitHub";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import { version } from "..";
import "./Footer.scss";

function Footer() {
    return (
        <Box className="footer-layout" component="footer">
            <Toolbar variant="dense">
                <Box className="footer-start">
                    <Typography variant="caption">{parseVersion(version)}</Typography>
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

function parseVersion(version: string): string {
    const semverRegex = /^(\d+\.\d+\.\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;
    const match = version.match(semverRegex);

    if (!match) return version;

    const [, core, prerelease, build] = match;

    return [
        `v${core}`,
        ...(prerelease ? [prerelease.replace(/\./g, "-")] : []),
        ...(build ? [build.replace(/\./g, "-")] : []),
    ].join("-");
}

export default Footer;
