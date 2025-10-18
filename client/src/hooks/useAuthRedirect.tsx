import * as React from "react";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../components/Request";

export function useAuthRedirect(
    setInitialised: React.Dispatch<React.SetStateAction<boolean>>,
    redirectTo: string = "/"
) {
    const navigate = useNavigate();

    React.useEffect(() => {
        let isMounted = true;

        (async () => {
            const init: RequestInit = { credentials: "include" };
            try {
                const response = await getRequest("/auth", init, true);
                if (!isMounted) return;
                else if (!response.ok) navigate(redirectTo, { replace: true });
                else setInitialised(true);
            } catch (err) {
                if (isMounted) setInitialised(true);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [navigate, redirectTo, setInitialised]);
}
