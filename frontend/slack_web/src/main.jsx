import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./css/core.css";
import "./i18n.js";

const Root = ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
