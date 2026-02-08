import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/*
      HashRouter avoids 404s on Vercel when the Telegram in-app browser refreshes/deep-links.
      It is also a common choice for Telegram WebApps.
    */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
