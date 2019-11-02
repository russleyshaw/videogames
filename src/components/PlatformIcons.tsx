import React from "react";
import { observer } from "mobx-react";
import { SemanticICONS, SemanticCOLORS, Popup, Icon, Label } from "semantic-ui-react";

import SettingsModel from "../models/settings_model";

const PLATFORM_INFO_LIST: Array<{
    name: string;
    key: string;
    iconName: SemanticICONS;
    subIcon?: SemanticICONS;
    color?: SemanticCOLORS;
}> = [
    { key: "pc", name: "Windows", iconName: "windows" },
    { key: "xone", name: "Xbox One", iconName: "xbox", color: "green" },
    { key: "ps4", name: "Playstation 4", iconName: "playstation", color: "blue" },
    { key: "vita", name: "Playstation Vita", iconName: "playstation", subIcon: "gamepad", color: "blue" },
    { key: "andr", name: "Android", iconName: "android", color: "green" },
    { key: "lin", name: "Linux", iconName: "linux" },
    { key: "nsw", name: "Nintendo Switch", iconName: "nintendo switch", color: "red" },
    { key: "stad", name: "Google Stadia", iconName: "google" },
    { key: "iphn", name: "iPhone", iconName: "apple", subIcon: "phone", color: "grey" },
    { key: "ipad", name: "iPad", iconName: "apple", subIcon: "tablet", color: "grey" },
    { key: "mac", name: "Mac", iconName: "apple", subIcon: "computer", color: "grey" },
    { key: "brow", name: "Browser", iconName: "internet explorer" }
];

const PLATFORM_KEYS = new Set(PLATFORM_INFO_LIST.map(p => p.key));

export default observer((props: { platforms: string[]; settings: SettingsModel }) => {
    const platforms = props.platforms.map(p => p.toLowerCase());
    const platformSet = new Set(platforms);

    if (props.settings.platformStyle === "text") {
        return <>{props.platforms.join(", ")}</>;
    }

    const unknownPlatforms = platforms.filter(p => !PLATFORM_KEYS.has(p));

    return (
        <>
            {PLATFORM_INFO_LIST.filter(info => platformSet.has(info.key)).map(info => (
                <Popup
                    position="top center"
                    content={info.name}
                    trigger={
                        info.subIcon != null ? (
                            <Icon.Group size="large">
                                <Icon color={info.color} name={info.iconName} />
                                <Icon corner="bottom right" name={info.subIcon} />
                            </Icon.Group>
                        ) : (
                            <Icon color={info.color} size="large" name={info.iconName} />
                        )
                    }
                />
            ))}
            {unknownPlatforms.length > 0 && unknownPlatforms.map(p => <Label>{p}</Label>)}
        </>
    );
});
