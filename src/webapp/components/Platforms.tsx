import * as React from "react";
import { observer } from "mobx-react";
import { sortBy, groupBy } from "lodash";

import { Tooltip } from "@material-ui/core";

import { getPlatformIconUrl, getPlatformOrder } from "../platforms";

export interface PlatformProps {
    platforms: PlatformData[];
}

export default observer((props: PlatformProps) => {
    const platformIconSize = 24;
    const groups = sortBy(
        Object.entries(groupBy(props.platforms, p => getPlatformIconUrl(p.abbrev))),
        ([, ps]) => Math.min(...ps.map(p => getPlatformOrder(p.abbrev)))
    );
    return (
        <React.Fragment>
            {groups.map(([src, ps]) => {
                const title = ps.map(p => p.name).join(", ");
                return (
                    <span key={ps[0].abbrev} style={{ marginRight: 4 }}>
                        <Tooltip title={title}>
                            <img
                                style={{ width: platformIconSize, height: platformIconSize }}
                                src={src}
                            />
                        </Tooltip>
                    </span>
                );
            })}
        </React.Fragment>
    );
});
