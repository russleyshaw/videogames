import { observable, autorun, action } from "mobx";

import * as keys from "../local_store_key";
import { contains } from "../util";

export type PlatformStyle = "icons" | "text";
export const PLATFORM_STYLES: PlatformStyle[] = ["icons", "text"];

export type ReleaseStyle = "relative" | "absolute";
export const RELEASE_STYLES: ReleaseStyle[] = ["relative", "absolute"];
export default class SettingsModel {
    @observable
    apiKey: string | undefined;

    @observable
    platformStyle: PlatformStyle;

    @observable
    releaseStyle: ReleaseStyle;

    constructor() {
        // Load api key
        const apiKey = localStorage.getItem(keys.API_KEY);
        if (apiKey != null) {
            this.apiKey = apiKey.trim();
            console.log(`Loaded ${keys.API_KEY}`, this.apiKey);
        }

        // Load platform style
        this.platformStyle = "icons";
        let platformStyle = localStorage.getItem(keys.PLATFORM_FORMAT);
        platformStyle = platformStyle != null ? platformStyle.trim() : null;
        if (platformStyle != null && contains(PLATFORM_STYLES, platformStyle as PlatformStyle)) {
            this.platformStyle = platformStyle as PlatformStyle;
            console.log(`Loaded ${keys.PLATFORM_FORMAT}`, this.platformStyle);
        }

        // Load release style
        this.releaseStyle = "relative";
        let releaseStyle = localStorage.getItem(keys.RELEASE_STYLE);
        if (releaseStyle != null && contains(RELEASE_STYLES, releaseStyle as ReleaseStyle)) {
            this.releaseStyle = releaseStyle as ReleaseStyle;
            console.log(`Loaded ${keys.RELEASE_STYLE}`, this.releaseStyle);
        }

        autorun(() => {
            localStorage.setItem(keys.PLATFORM_FORMAT, this.platformStyle);
        });
        autorun(() => {
            if (this.apiKey != null && this.apiKey != "") {
                localStorage.setItem(keys.API_KEY, this.apiKey);
            } else {
                localStorage.removeItem(keys.API_KEY);
            }
        });
        autorun(() => {
            localStorage.setItem(keys.RELEASE_STYLE, this.releaseStyle);
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

    @action
    cycleReleaseStyle() {
        const styleIdx = RELEASE_STYLES.findIndex(s => s === this.releaseStyle);
        if (styleIdx === -1) {
            this.releaseStyle = RELEASE_STYLES[0];
            return;
        }

        const newStyle = RELEASE_STYLES[(styleIdx + 1) % RELEASE_STYLES.length];
        this.releaseStyle = newStyle;
    }
}
