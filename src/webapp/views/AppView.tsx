import * as React from "react";
import * as _ from "lodash";
import { observer } from "mobx-react";

import { endOfDay, endOfMonth, endOfQuarter, endOfYear, isAfter, isBefore, setDate, setQuarter, setYear, setMonth} from "date-fns";

import { LoaderModel } from "../models/loader";
import { GameData, NOW } from "../util";
import GameList from "../components/GameList";

const datedGamesLoader = new LoaderModel(async () => {
    const gamesJson = await import("../../../games.json").then(m => (m as any).default as typeof m);
    return parseRawGames(gamesJson);
});
datedGamesLoader.load();

function parseRawGames(gameData: typeof import("../../../games.json")): GameData[] {
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

export default observer(() => {

    const isLoading = datedGamesLoader.result.status === "loading";
    const datedGames = datedGamesLoader.value ?? [];

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
        <div>
            <h3>
                Video Games
            </h3>

            <div>
                <GameList
                    loading={isLoading}
                    title="Upcoming"
                    tooltip="Games with a release date in the near future."
                    games={upcoming}
                />
                <GameList
                    title="Eventually"
                    tooltip="Games with rough release windows. Games here may only have a month or quarter scheduled for release"
                    games={whenever}
                    loading={isLoading}
                />
                <GameList
                    title="Released"
                    tooltip="Games recently released."
                    games={released}
                    loading={isLoading}
                />

                <p>
                    Data is courtesy of the <a href="https://www.giantbomb.com/">Giant Bomb</a> API.
            </p>
            </div>
        </div>
    );
});
