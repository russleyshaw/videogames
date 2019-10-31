import React from "react";
import { observer } from "mobx-react";
import { Classes, Dialog, ControlGroup, InputGroup, Button, Spinner } from "@blueprintjs/core";

import AppModel from "./app_model";
import { IGameInfo } from "./gbapi";
import moment from "moment";

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
                    <h3>We need your key!</h3>
                </div>

                <div className={Classes.DIALOG_BODY}>
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
            </Dialog>
            <div className="app">
                <div className="app-header">
                    <Button text="Reset API Key" icon="key" onClick={() => model.clearApiKey()} />
                    <Button disabled={model.isLoadingGames} text="Force update" icon="refresh" onClick={() => model.updateGames(true)} />
                    <span>Last updated: {model.lastCached ? moment(model.lastCached).fromNow() : "Never"}</span>
                </div>
                <div className="app-body">
                    <div className="game-list-section">
                        <div>
                            <h1>Upcoming Games </h1>
                            {model.isLoadingGames && <Spinner />}
                        </div>
                        <div className="game-list">
                            {model.getUpcomingGames().map(g => (
                                <GameEntry {...g} />
                            ))}
                        </div>
                    </div>
                    <div className="game-list-section">
                        <div>
                            <h1>Released Games</h1>
                            {model.isLoadingGames && <Spinner />}
                        </div>
                        <div className="game-list">
                            {model.getReleasedGames().map(g => (
                                <GameEntry {...g} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

function GameEntry(props: IGameInfo) {
    return (
        <>
            <span>{props.name}</span>
            <span>{moment(props.release).fromNow()}</span>
        </>
    );
}
