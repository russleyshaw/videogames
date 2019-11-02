import React from "react";
import ReactDOM from "react-dom";

import App from "./app_view";

import "./style/style.scss";
import appStore from "./models/app_store";
import settingsStore from "./models/settings_store";

ReactDOM.render(<App app={appStore} settings={settingsStore} />, document.getElementById("root"));
