import React from "react";
import styled from "styled-components";
import * as _ from "lodash";

import moment from "moment";
import rawGames from "../../games.json";

import {
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    Chip,
    Link,
    Paper,
    Container,
    Grid,
    Box,
    Avatar,
    Icon,
    Typography,
    useTheme
} from "@material-ui/core";
import PlatformAvatar from "./PlatformAvatar";

interface GameData {
    id: number;
    name: string;
    link: string;
    release: moment.Moment;
    firm: boolean;
    released: boolean;
    platforms: Array<PlatformData>;
}

interface PlatformData {
    id: number;
    abbrev: string;
    name: string;
    link: string;
}

const datedGames = parseRawGames();

function parseRawGames(): GameData[] {
    const result: GameData[] = [];
    for (const g of rawGames) {
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
                    link: p.site_detail_url
                })) ?? [],
            released: g.original_release_date != null,
            firm:
                (g.expected_release_year != null &&
                    g.expected_release_month != null &&
                    g.expected_release_day != null) ||
                g.original_release_date != null
        });
    }

    return result;
}

const now = moment();
const startOfToday = moment(now).startOf("date");
const startOfTomorrow = moment(now)
    .add(1, "day")
    .startOf("date");
const startOfNextDay = moment(now)
    .add(2, "day")
    .startOf("date");

const released = _.sortBy(
    datedGames.filter(g => g.release.isBefore(now)),
    g => -g.release.valueOf()
);
const upcoming = _.sortBy(
    datedGames.filter(g => g.release.isAfter(now) && g.firm),
    g => g.release.valueOf()
);

const whenever = _.sortBy(
    datedGames.filter(g => g.release.isAfter(now) && !g.firm),
    g => g.release.valueOf()
);

export default function App(): JSX.Element {
    const theme = useTheme();

    return (
        <Container maxWidth="xl">
            <Typography style={{ margin: theme.spacing(2) }} variant="h3" align="center">
                Video Games
            </Typography>

            <Grid style={{ overflowY: "auto" }} container spacing={2}>
                <Grid xs={12} lg={6} xl={8} item>
                    <Grid container spacing={2}>
                        <Grid xs={12} xl={6} item>
                            <GameList title="Upcoming" games={upcoming} />
                        </Grid>
                        <Grid xs={12} xl={6} item>
                            <GameList title="Whenever" games={whenever} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid xs={12} lg={6} xl={4} item>
                    <GameList title="Released" games={released} />
                </Grid>
            </Grid>
        </Container>
    );
}

interface GameListProps {
    games: GameData[];
    title: string;
}

function GameList(props: GameListProps): JSX.Element {
    const theme = useTheme();
    return (
        <Paper>
            <Grid container>
                <Typography style={{ margin: theme.spacing(2) }} align="center" variant="h4">
                    {props.title}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Platforms</TableCell>
                                <TableCell>Release</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.games.map(g => (
                                <TableRow key={g.name}>
                                    <TableCell>
                                        <Link
                                            href={g.link}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            {g.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Grid container>
                                            {g.platforms.map(p => (
                                                <Grid item key={p.abbrev}>
                                                    <Chip
                                                        clickable
                                                        label={p.abbrev}
                                                        title={p.name}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </TableCell>
                                    <TableCell>
                                        {!g.firm ? "maybe " : ""}
                                        {fromNow(g.release)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Paper>
    );
}

function fromNow(date: moment.Moment): string {
    if (date.isBetween(startOfToday, startOfTomorrow)) {
        return "Today!";
    }

    if (date.isBetween(startOfTomorrow, startOfNextDay)) {
        return "Tomorrow!";
    }

    return date.fromNow();
}
