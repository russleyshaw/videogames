import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";
import App from "./app";

const theme = createMuiTheme({});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.getElementById("root")
);
