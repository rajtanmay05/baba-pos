import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ProductProvider } from "./context/ProductContext";
import { SalesProvider } from "./context/SalesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductProvider>
  <SalesProvider>
    <App />
  </SalesProvider>
</ProductProvider>
  </React.StrictMode>
);