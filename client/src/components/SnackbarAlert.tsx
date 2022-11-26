import { Alert, AlertColor, AlertTitle } from "@mui/material";
import { CustomContentProps, SnackbarContent, useSnackbar } from "notistack";
import { forwardRef, useCallback } from "react";

export type Severity = AlertColor;

interface SnackbarAlertProps extends CustomContentProps {
    severity: Severity;
    status: number;
    statusText: string;
}

export const SnackbarAlert = forwardRef<HTMLDivElement, SnackbarAlertProps>(({ id, ...props }, ref) => {
    const { message, severity, status, statusText } = props;

    const { closeSnackbar } = useSnackbar();

    function handleClose(e: React.SyntheticEvent) {
        handleDismiss();
        e.preventDefault();
        e.stopPropagation();
    }
    const handleDismiss = useCallback(() => {
        closeSnackbar(id);
    }, [id, closeSnackbar]);

    return (
        <SnackbarContent ref={ref}>
            <Alert onClose={handleClose} severity={severity} sx={{ minWidth: 228, width: "100%" }}>
                <AlertTitle>
                    {status && statusText
                        ? status + " - " + statusText
                        : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </AlertTitle>
                {message}
            </Alert>
        </SnackbarContent>
    );
});

SnackbarAlert.displayName = "SnackbarAlert";
