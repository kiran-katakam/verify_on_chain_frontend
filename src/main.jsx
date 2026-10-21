import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "@fontsource/bodoni-moda/500.css";
import "@fontsource/bodoni-moda/600.css";
import "@fontsource/bodoni-moda/500-italic.css";
import "@fontsource/libre-franklin/400.css";
import "@fontsource/libre-franklin/500.css";
import "@fontsource/libre-franklin/600.css";
import "@fontsource/libre-franklin/700.css";
import "@fontsource/courier-prime/400.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
