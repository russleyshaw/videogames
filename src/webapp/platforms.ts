// Known platform icons
import windows from "../../static/icons/windows.svg";
import xbox from "../../static/icons/xbox.svg";
import playstation from "../../static/icons/playstation.svg";
import nsw from "../../static/icons/nsw.svg";
import stadia from "../../static/icons/stadia.svg";
import android from "../../static/icons/android.svg";
import linux from "../../static/icons/linux.svg";
import apple from "../../static/icons/apple.svg";
import amiga from "../../static/icons/amiga.svg";
import c64 from "../../static/icons/c64.svg";

import quest from "../../static/icons/quest.svg";

import unknownPlatform from "../../static/icons/unknown.svg";

import { safeFindIndex } from "../common/util";

const PLATFORM_ABBREVS_ORDER = [
    // PCs
    "PC",
    "MAC",
    "LIN",

    // Consoles - Sony
    "PS5",
    "PS4",

    // Consoles - Microsoft
    "XSX",
    "XONE",
    "XBOX",

    // Consoles - Nintendo
    "NSW",

    // Phones/Mobile
    "ANDR",
    "IPHN",
    "IPAD",
    "APTV",

    // Streaming
    "STAD",
];

export function getPlatformOrder(abbrev: string): number {
    const iconUrl = getPlatformIconUrl(abbrev);

    // Unknown should be last
    if (iconUrl === unknownPlatform) return Infinity;

    return (
        safeFindIndex(PLATFORM_ABBREVS_ORDER, a => a === abbrev) ?? PLATFORM_ABBREVS_ORDER.length
    );
}

export function getPlatformIconUrl(abbrev: string): string {
    switch (abbrev) {
        case "PC":
        case "BROW":
            return windows;
        case "XONE":
        case "XBOX":
        case "XSX":
            return xbox;

        case "PS4":
        case "PS5":
        case "PSNV":
            return playstation;

        case "NSW":
            return nsw;

        case "STAD":
            return stadia;

        case "ANDR":
            return android;

        case "LIN":
            return linux;

        case "IPHN":
        case "MAC":
        case "IPAD":
        case "APTV":
            return apple;

        case "AMI":
            return amiga;

        case "C64":
            return c64;

        case "OQST":
            return quest;
    }

    return unknownPlatform;
}
