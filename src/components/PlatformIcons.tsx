import React from "react";
import { observer } from "mobx-react";
import { SemanticICONS, SemanticCOLORS, Popup, Icon, Label, Image } from "semantic-ui-react";

import { IPlatformInfo } from "../types";

const stadiaLogo = require("../../static/Stadia_logo.svg");

interface IPlatformData {
    key: string;
    name: string;
    abbrev: string;
    iconName?: SemanticICONS;
    subIcon?: SemanticICONS;
    color?: SemanticCOLORS;
    logoUrl?: string;
}
const PLATFORM_INFO_LIST: Array<IPlatformData> = [
    { key: "pc", abbrev: "PC", name: "Windows", iconName: "windows" },
    { key: "xone", abbrev: "XONE", name: "Xbox One", iconName: "xbox", color: "green" },
    { key: "ps4", abbrev: "PS4", name: "Playstation 4", iconName: "playstation", color: "blue" },
    { key: "vita", abbrev: "VITA", name: "Playstation Vita", iconName: "playstation", subIcon: "gamepad", color: "blue" },
    { key: "andr", abbrev: "ANDR", name: "Android", iconName: "android", color: "green" },
    { key: "lin", abbrev: "LIN", name: "Linux", iconName: "linux" },
    { key: "nsw", abbrev: "NSW", name: "Nintendo Switch", iconName: "nintendo switch", color: "red" },
    { key: "stad", abbrev: "STAD", name: "Google Stadia", logoUrl: stadiaLogo },
    { key: "appl", abbrev: "IPHN", name: "iPhone", iconName: "apple", subIcon: "phone", color: "grey" },
    { key: "appl", abbrev: "IPAD", name: "iPad", iconName: "apple", subIcon: "tablet", color: "grey" },
    { key: "appl", abbrev: "MAC", name: "Mac", iconName: "apple", subIcon: "computer", color: "grey" },
    { key: "brow", abbrev: "BROW", name: "Browser", iconName: "internet explorer" }
];

const PLATFORM_ABBREVS = new Set(PLATFORM_INFO_LIST.map(p => p.abbrev));

export default observer((props: { platforms: IPlatformInfo[] }) => {
    const platformAbbrs = new Set(props.platforms.map(p => p.abbreviation));
    const infos = PLATFORM_INFO_LIST.filter(p => platformAbbrs.has(p.abbrev));

    const unknownPlatforms = props.platforms.filter(p => !PLATFORM_ABBREVS.has(p.abbreviation));

    return (
        <>
            {infos.map(info => (
                <Popup position="top center" content={info.name} trigger={renderIcon(info)} />
            ))}
            {unknownPlatforms.map(p => (
                <Popup trigger={<Label>{p.abbreviation}</Label>} content={p.name} />
            ))}
        </>
    );

    function renderIcon(info: IPlatformData) {
        if (info.logoUrl != null) {
            return <Image avatar src={info.logoUrl} />;
        }
        if (info.iconName != null) {
            if (info.subIcon != null) {
                return (
                    <Icon.Group size="large">
                        <Icon color={info.color} name={info.iconName} />
                        <Icon corner="bottom right" name={info.subIcon} />
                    </Icon.Group>
                );
            }

            return <Icon color={info.color} size="large" name={info.iconName} />;
        }

        return <Label>{info.abbrev}</Label>;
    }
});
