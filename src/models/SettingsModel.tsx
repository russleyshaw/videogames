import { observable, autorun, action } from "mobx";

import * as keys from "../constants";

export default class SettingsModel {
    @observable
    apiKey: string | undefined;

    constructor() {
        // Load api key
        const apiKey = localStorage.getItem(keys.API_KEY);
        if (apiKey != null) {
            this.apiKey = apiKey.trim();
            console.log(`Loaded ${keys.API_KEY}`, this.apiKey);
        }

        autorun(() => {
            if (this.apiKey != null && this.apiKey != "") {
                localStorage.setItem(keys.API_KEY, this.apiKey);
            } else {
                localStorage.removeItem(keys.API_KEY);
            }
        });
    }
}
