import { observable, autorun, action } from "mobx";

import * as keys from "../local_store_key";
import { platform } from "os";

export type PlatformStyle = "icons" | "text";
export const PLATFORM_STYLES: PlatformStyle[] = ["icons", "text"];
export default class SettingsModel {
    @observable
    apiKey: string | undefined;

    @observable
    platformStyle: PlatformStyle;

    constructor() {
        const apiKey = localStorage.getItem(keys.API_KEY);
        if (apiKey != null) {
            this.apiKey = apiKey.trim();
            console.log(`Loaded ${keys.API_KEY}`, this.apiKey);
        }
        this.platformStyle = "icons";
        let platformStyle = localStorage.getItem(keys.PLATFORM_FORMAT);
        platformStyle = platformStyle != null ? platformStyle.trim() : null;
        if (platformStyle != null && PLATFORM_STYLES.includes(platformStyle as PlatformStyle)) {
            this.platformStyle = platformStyle as PlatformStyle;
            console.log(`Loaded ${keys.PLATFORM_FORMAT}`, this.platformStyle);
        }

        autorun(() => {
            console.log("Saving platform format...");
            localStorage.setItem(keys.PLATFORM_FORMAT, this.platformStyle);
        });
        autorun(() => {
            console.log("Saving api key...");
            if (this.apiKey != null) localStorage.setItem(keys.API_KEY, this.apiKey);
            else localStorage.removeItem(keys.API_KEY);
        });
    }

    @action
    cyclePlatformStyle() {
        const styles: PlatformStyle[] = ["icons", "text"];
        const styleIdx = styles.findIndex(s => s === this.platformStyle);
        if (styleIdx === -1) {
            this.platformStyle = styles[0];
            return;
        }

        const newStyle = styles[(styleIdx + 1) % styles.length];
        this.platformStyle = newStyle;
    }
}