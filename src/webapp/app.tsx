import React from "react";
import styled from "styled-components";
import * as _ from "lodash";

import moment from "moment";
import rawGames from "../../games.json";

const datedGames = rawGames.map(g => {
    let expected = moment();

    expected.date(g.expected_release_day);
    expected.month(g.expected_release_month - 1);
    expected.year(g.expected_release_year);

    expected = expected.startOf("date");

    return {
        ...g,
        expected
    };
});

const now = moment();
const tomorrow = moment(now).add(1, "day");

const released = _.sortBy(
    datedGames.filter(g => g.expected.isBefore(now)),
    g => -g.expected.valueOf()
);
const upcoming = _.sortBy(
    datedGames.filter(g => g.expected.isAfter(now)),
    g => g.expected.valueOf()
);

const MyDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

const GameList = styled.div`
    display: grid;
    grid-template-columns: 1fr;
`;

export default function App(): JSX.Element {
    return (
        <MyDiv>
            <h3>Upcoming Games</h3>
            <h3>Released Games</h3>
            <GameList>
                {upcoming.map(g => (
                    <React.Fragment key={g.guid}>
                        <a href={g.site_detail_url} target="_blank">
                            {g.name}
                        </a>{" "}
                        {fromNow(g.expected)}
                    </React.Fragment>
                ))}
            </GameList>
            <GameList>
                {released.map(g => (
                    <React.Fragment key={g.guid}>
                        <a href={g.site_detail_url} target="_blank">
                            {g.name}
                        </a>{" "}
                        {fromNow(g.expected)}
                    </React.Fragment>
                ))}
            </GameList>
        </MyDiv>
    );
}

function fromNow(date: moment.Moment): string {
    if (date.isBetween(now, tomorrow)) {
        return "Soon!";
    }

    return date.fromNow();
}
