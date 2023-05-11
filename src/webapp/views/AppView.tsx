import * as React from "react";
import * as _ from "lodash";
import { observer } from "mobx-react";

import {
    endOfDay,
    endOfMonth,
    endOfQuarter,
    endOfYear,
    isAfter,
    isBefore,
    setDate,
    setQuarter,
    setYear,
    setMonth,
} from "date-fns";

import { GameData, NOW } from "../util";
import GameList from "../components/GameList";

import classes from "./AppView.module.scss";

import gamesJson from "../../../games.json";
console.log(gamesJson);

function parseRawGames(gameData: typeof gamesJson): GameData[] {
    const result: GameData[] = [];
    for (const g of gameData) {
        const now = new Date();
        let expected = endOfDay(now);
        if (g.original_release_date != null) {
            // Found release date
            expected = new Date(g.original_release_date);
        } else {
            // Estimate a release

            // Don't bother with games without at least a quarter resolution
            if (g.expected_release_year == null) continue;
            if (g.expected_release_quarter == null && g.expected_release_month == null) continue;

            expected = setYear(expected, g.expected_release_year);
            expected = endOfYear(expected);

            if (g.expected_release_quarter != null) {
                expected = setQuarter(expected, g.expected_release_quarter);
                expected = endOfQuarter(expected);
            }

            if (g.expected_release_month != null) {
                expected = setMonth(expected, g.expected_release_month - 1);
                expected = endOfMonth(expected);
            }

            if (g.expected_release_day != null) {
                expected = setDate(expected, g.expected_release_day);
                expected = endOfDay(expected);
            }
        }

        result.push({
            id: g.id,
            link: g.site_detail_url,
            name: g.name,
            release: expected,
            platforms:
                g.platforms?.map(p => ({
                    id: p.id,
                    name: p.name,
                    abbrev: p.abbreviation,
                    link: p.site_detail_url,
                })) ?? [],
            released: g.original_release_date != null,
            firm:
                (g.expected_release_year != null &&
                    g.expected_release_month != null &&
                    g.expected_release_day != null) ||
                g.original_release_date != null,
        });
    }

    return result;
}

const datedGames = parseRawGames(gamesJson);

export default observer(() => {
    const released = _.sortBy(
        datedGames.filter(g => isBefore(g.release, NOW)),
        g => -g.release.valueOf()
    );
    const upcoming = _.sortBy(
        datedGames.filter(g => isAfter(g.release, NOW) && g.firm),
        g => g.release.valueOf()
    );

    const whenever = _.sortBy(
        datedGames.filter(g => isAfter(g.release, NOW) && !g.firm),
        g => g.release.valueOf()
    );

    return (
        <div className={classes.root}>
            <h1>Video Games</h1>

            <span>
                Data is courtesy of the <a href="https://www.giantbomb.com/">Giant Bomb</a> API.
            </span>

            <div className={classes.gameLists}>
                <GameList
                    title="Upcoming"
                    subtitle="Games with a release date in the near future."
                    games={upcoming}
                />
                <GameList
                    title="Eventually"
                    subtitle={
                        <>
                            Games with rough release windows.
                            <br />
                            These only have a month or quarter scheduled for release.
                        </>
                    }
                    games={whenever}
                />
                <GameList title="Released" subtitle="Games recently released." games={released} />
            </div>
        </div>
    );
});
