import React from "react";
import { MobXProviderContext } from "mobx-react";

import SettingsModel from "./models/SettingsModel";
import AppModel from "./models/AppModel";

const app = new AppModel();
const settings = new SettingsModel();

const StoreContext = React.createContext({ app, settings });

export function useStores() {
    return React.useContext(StoreContext);
}

export function useSettingsStore() {
    const { settings } = useStores();
    return settings;
}

export function useAppStore() {
    const { app } = useStores();
    console.log("Using App Store", app.games);
    return app;
}
