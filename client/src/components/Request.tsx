import { AlertColor } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { snackbars } from "../App";

declare module "notistack" {
    interface VariantOverrides {
        alert: { severity: AlertColor; status: number; statusText: string };
    }
}

export async function getRequest(input: RequestInfo | URL) {
    return fetch("http://localhost:8080/api" + input, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(showResponse);
}

export async function postRequest(input: RequestInfo | URL, body: any) {
    return fetch("http://localhost:8080/api" + input, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    }).then(showResponse);
}

export async function showResponse(response: Response) {
    const json = await response.json();
    let severity: AlertColor = "info";

    switch (~~(response.status / 100)) {
        default:
        case 1:
            severity = "info";
            break;
        case 2:
            severity = "success";
            break;
        case 3:
            severity = "info";
            break;
        case 4:
            severity = "error";
            break;
        case 5:
            severity = "warning";
            break;
    }

    const message = isJsonString(json) ? json ?? "" : json?.message ?? "";
    snackbars.push(
        enqueueSnackbar(message, {
            variant: "alert",
            severity: severity,
            status: response.status,
            statusText: response.statusText,
        })
    );

    return response;
}

function isJsonString(str: string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
