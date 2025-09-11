import { AlertColor } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { snackbars } from "../App";

declare module "notistack" {
    interface VariantOverrides {
        alert: { severity: AlertColor; status: number; statusText: string };
    }
}

const API_URL = process.env.REACT_APP_API_URL || "";
const EMPTY_JSON = JSON.stringify({});

export async function getRequest(input: RequestInfo | URL, quiet?: boolean) {
    let response: Response;
    try {
        response = await fetch(API_URL + input, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error);
        response = new Response(EMPTY_JSON, {
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (!quiet) showResponse(response.clone());
    return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function postRequest(input: RequestInfo | URL, body: any, quiet?: boolean) {
    let response: Response;
    try {
        response = await fetch(API_URL + input, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
    } catch (error) {
        console.error(error);
        response = new Response(EMPTY_JSON, {
            status: 500,
            statusText: "Internal Server Error",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    if (!quiet) showResponse(response.clone());
    return response;
}

export async function showResponse(response: Response) {
    const { status, statusText } = response;

    let json;
    try {
        json = await response.json();
    } catch (error) {
        // don't handle error here - caller is responsible
        json = null;
    }

    let severity: AlertColor;
    switch (~~(status / 100)) {
        default:
        case 1:
        case 3:
            severity = "info";
            break;
        case 2:
            severity = "success";
            break;
        case 4:
            severity = "error";
            break;
        case 5:
            severity = "warning";
            break;
    }

    snackbars.push(
        enqueueSnackbar(json?.message || "", {
            variant: "alert",
            severity,
            status,
            statusText,
        })
    );
}

export function getRedirectTo() {
    const query = new URLSearchParams(window.location.search);
    const redirect = query.get("redirect");
    return redirect || "/";
}
