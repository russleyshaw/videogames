import * as React from "react";
import { ThemeProvider, createMuiTheme, CssBaseline } from "@material-ui/core";
import AppView from "./AppView";
import { hot } from "react-hot-loader/root";

const theme = createMuiTheme();

function RootView(): JSX.Element {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppView />
        </ThemeProvider>
    );
}

export default hot(RootView);
