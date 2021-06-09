import * as React from "react";
import { observer } from "mobx-react";


import Platforms from "./Platforms";
import { GameData, fromNow } from "../util";

export interface GameListProps {
    games: GameData[];
    title: string;
    tooltip: string;
    loading?: boolean;
}

export default observer((props: GameListProps) => {

    const loadingRow = (
        <tr>
            <td>Loading...</td>
            <td>
                ...
            </td>
            <td>Soon</td>
        </tr>
    );

    const gameRows = props.games.map(g => (
        <tr key={g.name}>
            <td>
                <a href={g.link} rel="noopener noreferrer" target="_blank">
                    {g.name}
                </a>
            </td>
            <td>
                <Platforms platforms={g.platforms} />
            </td>
            <td>
                {!g.firm ? "maybe " : ""}
                {fromNow(g.release)}
            </td>
        </tr>
    ));

    return (
        <div>
            <h4>
                {props.title}
            </h4>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Platforms</td>
                        <td>Release</td>
                    </tr>
                </thead>
                <tbody>{props.loading ? loadingRow : gameRows}</tbody>
            </table>
        </div>
    );
});
