import * as React from "react";
import * as _ from "lodash";
import { observer } from "mobx-react";

import * as moment from "moment";

import {
    Container,
    Grid,
    Typography,
    useTheme,
    Tooltip,
    CircularProgress,
} from "@material-ui/core";
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
        let expected = moment().endOf("date");
        if (g.original_release_date != null) {
            // Found release date
            expected = moment(g.original_release_date);
        } else {
            // Estimate a release

            // Don't bother with games without at least a quarter resolution
            if (g.expected_release_year == null) continue;
            if (g.expected_release_quarter == null && g.expected_release_month == null) continue;

            expected.year(g.expected_release_year);
            expected = expected.endOf("year");

            if (g.expected_release_quarter != null) {
                expected.quarter(g.expected_release_quarter);
                expected = expected.endOf("quarter");
            }

            if (g.expected_release_month != null) {
                expected.month(g.expected_release_month - 1);
                expected = expected.endOf("month");
            }

            if (g.expected_release_day != null) {
                expected.date(g.expected_release_day);
                expected = expected.endOf("date");
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
    const theme = useTheme();

    const isLoading = datedGamesLoader.result.status === "loading";
    const datedGames = datedGamesLoader.value ?? [];

    const released = _.sortBy(
        datedGames.filter(g => g.release.isBefore(NOW)),
        g => -g.release.valueOf()
    );
    const upcoming = _.sortBy(
        datedGames.filter(g => g.release.isAfter(NOW) && g.firm),
        g => g.release.valueOf()
    );

    const whenever = _.sortBy(
        datedGames.filter(g => g.release.isAfter(NOW) && !g.firm),
        g => g.release.valueOf()
    );

    return (
        <Container maxWidth="xl">
            <Tooltip title="A calendar of releasing and released games.">
                <Typography style={{ margin: theme.spacing(2) }} variant="h3" align="center">
                    Video Games
                </Typography>
            </Tooltip>

            <Grid style={{ overflowY: "auto" }} container spacing={2}>
                <Grid xs={12} lg={6} xl={8} item>
                    <Grid container spacing={2}>
                        <Grid xs={12} xl={6} item>
                            <GameList
                                loading={isLoading}
                                title="Upcoming"
                                tooltip="Games with a release date in the near future."
                                games={upcoming}
                            />
                        </Grid>
                        <Grid xs={12} xl={6} item>
                            <GameList
                                title="Eventually"
                                tooltip="Games with rough release windows. Games here may only have a month or quarter scheduled for release"
                                games={whenever}
                                loading={isLoading}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={12} lg={6} xl={4} item>
                    <GameList
                        title="Released"
                        tooltip="Games recently released."
                        games={released}
                        loading={isLoading}
                    />
                </Grid>
            </Grid>

            <Typography style={{ margin: theme.spacing(2) }} align="right">
                Data is courtesy of the <a href="https://www.giantbomb.com/">Giant Bomb</a> API.
            </Typography>
        </Container>
    );
});
