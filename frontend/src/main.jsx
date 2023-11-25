import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import theme from "./theme";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { router } from "../App";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <ToastContainer theme="colored" position="top-center"></ToastContainer>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
  </React.StrictMode>
);
