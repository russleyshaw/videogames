import React from "react";
import ReactDOM from "react-dom";

import AppModel from "./app_model";
import App from "./app_view";

import "./style.scss";

const model = new AppModel();

ReactDOM.render(<App model={model} />, document.getElementById("root"));
