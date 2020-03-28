import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import App from "./app";

const GlobalStyle = createGlobalStyle`
    body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }
`;

ReactDOM.render(
    <React.Fragment>
        <GlobalStyle />
        <App />
    </React.Fragment>,
    document.getElementById("root")
);
