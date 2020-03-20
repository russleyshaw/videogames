import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import * as _ from "lodash";

import games from "../../games.json";

const datedGames = games.map(g => {
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

const upcomingGames = _.sortBy(
    datedGames.filter(g => g.expected.isBefore(now)),
    g => -g.expected.valueOf()
);
const releasedGames = _.sortBy(
    datedGames.filter(g => g.expected.isAfter(now)),
    g => g.expected.valueOf()
);

function fromNow(date: moment.Moment): string {
    if (date.isBetween(now, tomorrow)) {
        return "Soon!";
    }

    return date.fromNow();
}

ReactDOM.render(
    <div style={{ display: "flex", flexDirection: "row" }}>
        <ul>
            {upcomingGames.map(g => (
                <li>
                    <a href={g.site_detail_url} target="_blank">
                        {g.name}
                    </a>{" "}
                    {fromNow(g.expected)}
                </li>
            ))}
        </ul>
        <ul>
            {releasedGames.map(g => (
                <li>
                    <a href={g.site_detail_url} target="_blank">
                        {g.name}
                    </a>{" "}
                    {fromNow(g.expected)}
                </li>
            ))}
        </ul>
    </div>,
    document.getElementById("root")
);
