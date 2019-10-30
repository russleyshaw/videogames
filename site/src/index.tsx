import "fetch";
import "./style.scss";

import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";
import * as path from "path";
import { IGameInfo } from "common";
import { useAsyncState } from "./hooks";

const API_BASEURL = process.env.API_BASEURL || "http://localhost:3000";

async function getUpcomingGames() {
    const url = new URL(API_BASEURL);
    url.pathname = path.join(url.pathname, "/api/upcoming");
    const res: IGameInfo[] = await fetch(url.toString()).then(r => r.json());
    return res;
}

async function getReleasedGames() {
    const url = new URL(API_BASEURL);
    url.pathname = path.join(url.pathname, "/api/released");
    const res: IGameInfo[] = await fetch(url.toString()).then(r => r.json());
    return res;
}

function UpcomingGames() {
    const [games, loading] = useAsyncState(getUpcomingGames, []);

    return (
        <div className="upcoming-games">
            <h1>Upcoming:</h1>
            {loading && <span>Loading...</span>}
            <div className="game-list">
                {games &&
                    games.map(g => (
                        <>
                            <span>{g.name}</span>
                            <span>{moment(g.release).fromNow()}</span>
                        </>
                    ))}
            </div>
        </div>
    );
}

function ReleasedGames() {
    const [games, loading] = useAsyncState(getReleasedGames, []);

    return (
        <div className="released-games">
            <h1>Released:</h1>
            {loading && <span>Loading...</span>}
            <div className="game-list">
                {games &&
                    games.map(g => (
                        <>
                            <span>{g.name}</span>
                            <span>{moment(g.release).fromNow()}</span>
                        </>
                    ))}
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app">
            <UpcomingGames />
            <ReleasedGames />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
