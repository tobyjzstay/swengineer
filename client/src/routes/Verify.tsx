import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingLayout from "../components/LoadingLayout";
import { getRequest } from "../components/Request";
import { PageNotFoundComponent } from "./PageNotFound";

function Verify() {
    const [componentToRender, setComponentToRender] = React.useState(<LoadingLayout />);
    const navigate = useNavigate();
    const token = useParams().token;

    React.useEffect(() => {
        getRequest(`/auth/register/${token}`).then((response) => {
            if (response.ok) navigate("/login", { replace: true });
            else setComponentToRender(<PageNotFoundComponent />);
        });
    }, []);

    return componentToRender;
}

export default Verify;
