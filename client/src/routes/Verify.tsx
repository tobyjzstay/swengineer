import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../App";
import { getRequest } from "../components/Request";
import PageNotFound from "./PageNotFound";

function Verify() {
    const context = React.useContext(Context);

    const [componentToRender, setComponentToRender] = React.useState<React.JSX.Element>(<></>);

    const navigate = useNavigate();
    const { token } = useParams();

    React.useMemo(() => {
        context.loading[1]((prev) => prev + 1);
        getRequest(`/auth/register/${token}`, true).then((response) => {
            if (response.ok) navigate("/login", { replace: true });
            else setComponentToRender(<PageNotFound />);
            context.loading[1]((prev) => prev - 1);
        });
    }, []);

    return componentToRender;
}

export default Verify;
