import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import "./index.css";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Reddit Sans, sans-serif",
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </ConfigProvider>
  </React.StrictMode>
);
