import "@fontsource/cascadia-mono";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";

export const version = process.env.REACT_APP_VERSION || "0.0.0-" + process.env.NODE_ENV;
console.debug(version);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
