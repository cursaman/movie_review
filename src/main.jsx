import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router";
import { AuthProvider } from "./context/AuthContext";
import "./style/index.css";

createRoot(document.getElementById("root")).render(<StrictMode><AuthProvider><Router /></AuthProvider></StrictMode>);
