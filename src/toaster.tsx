import React from "react";
import { Toaster, Intent } from "@blueprintjs/core";
import moment from "moment";

export const appToaster = Toaster.create({
    position: "top"
});

export function toastGBApiBlocked() {
    appToaster.show({
        message: (
            <div>
                <p>Failed to connect to Giant Bomb.</p>
                <p>Your API KEY might be incorrect or you might be blocking it.</p>
                <span>Culprits could include:</span>
                <ul>
                    <li>Adblockers</li>
                    <li>Privacy Badger</li>
                    <li>Ghostery</li>
                </ul>
            </div>
        ),
        intent: Intent.DANGER
    });
}
