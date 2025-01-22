import GitHub from "@mui/icons-material/GitHub";
import { Box, IconButton, Toolbar } from "@mui/material";
import "./Footer.scss";

function Footer() {
    return (
        <Box className="footer-layout" component="footer">
            <Toolbar variant="dense">
                <Box className="footer-start"></Box>
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
