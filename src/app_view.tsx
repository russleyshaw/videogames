import React from "react";
import { observer } from "mobx-react";
import { Classes, Dialog, ControlGroup, InputGroup, Button, Spinner, HTMLTable, Icon, H1 } from "@blueprintjs/core";
import moment from "moment";

import AppModel from "./app_model";
import { IGameInfo } from "./gbapi";

export interface IAppProps {
    model: AppModel;
}

export default observer((props: IAppProps) => {
    const { model } = props;

    const [apiKeyInput, setApiKeyInput] = React.useState("");

    return (
        <>
            <Dialog isOpen={model.apiKey == null}>
                <div className={Classes.DIALOG_HEADER}>
                    <h3>We need your Giant Bomb API key!</h3>
                </div>

                <div className={Classes.DIALOG_BODY}>
                    <p>
                        Get your key at{" "}
                        <a href="https://www.giantbomb.com/api/" target="_blank">
                            https://www.giantbomb.com/api/
                        </a>
                    </p>
                    <ControlGroup fill>
                        <InputGroup
                            value={apiKeyInput}
                            onChange={(e: any) => setApiKeyInput(e.target.value)}
                            placeholder="YOUR_GB_API_KEY_HERE"
                            fill
                        />
                        <Button
                            text="Save"
                            onClick={() => {
                                setApiKeyInput("");
                                model.setApiKey(apiKeyInput);
                            }}
                        />
                    </ControlGroup>
                </div>
                <div className={Classes.DIALOG_FOOTER}>Your key is stored locally.</div>
            </Dialog>
            <div className="app">
                <div className="app-header">
                    <Button text="Reset API Key" icon="key" onClick={() => model.clearApiKey()} />
                    <Button disabled={model.isLoadingGames} text="Force update" icon="refresh" onClick={() => model.updateGames(true)} />
                    <span>Last updated: {model.lastCached ? moment(model.lastCached).fromNow() : "Never"}</span>
                </div>
                <div className="app-body">
                    <H1>Upcoming Games </H1>
                    <H1>Released Games</H1>
                    <GameTable games={model.getUpcomingGames()} />
                    <GameTable games={model.getReleasedGames()} />
                </div>
            </div>
        </>
    );
});

const GameTable = observer((props: { games: IGameInfo[] }) => {
    return (
        <HTMLTable className="game-table" striped interactive condensed>
            <thead>
                <td>Name</td>
                <td>Platforms</td>
                <td>Release</td>
            </thead>
            <tbody>
                {props.games.map(g => (
                    <tr title={g.link} onDoubleClick={() => window.open(g.link)}>
                        <td>{g.name}</td>
                        <td>{g.platforms.join(", ")}</td>
                        <td>{moment(g.release).fromNow()}</td>
                    </tr>
                ))}
            </tbody>
        </HTMLTable>
    );
});
