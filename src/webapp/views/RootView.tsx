import * as React from "react";
import AppView from "./AppView";
import { hot } from "react-hot-loader/root";

function RootView(): JSX.Element {
    return (
        <div>
            <AppView />
        </div>
    );
}

export default hot(RootView);
