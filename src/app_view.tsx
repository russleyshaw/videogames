import React from "react";
import { observer, useObserver } from "mobx-react";
import moment from "moment";

import AppModel from "./models/app_model";
import { IGameInfo } from "./gbapi";

import {
    Button,
    Sidebar,
    Table,
    Input,
    Menu,
    Modal,
    ButtonProps,
    Icon,
    Popup,
    SemanticICONS,
    SemanticCOLORS,
    Label,
    Message,
    Checkbox,
    IconProps
} from "semantic-ui-react";
import { observable } from "mobx";
import SettingsModel, { PlatformStyle } from "./models/settings_model";
import PlatformIcons from "./components/PlatformIcons";

interface IModels {
    app: AppModel;
    settings: SettingsModel;
}

export default observer((props: IModels) => {
    const { app, settings } = props;

    return (
        <>
            <SettingsDrawer {...props} />
            <Menu>
                <Menu.Item header>Video Games</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item
                        disabled={app.isLoadingGames}
                        onClick={() => app.updateGames()}
                        icon={{ name: "refresh", loading: app.isLoadingGames } as IconProps}
                    />
                    <Menu.Item icon="setting" onClick={() => (app.isSettingsOpen = true)} />
                </Menu.Menu>
            </Menu>
            {settings.apiKey == null && <Message negative>No Giant Bomb API provided.</Message>}
            <div className="game-tables">
                <GameTable settings={settings} title="Upcoming Games" games={app.upcomingGames} loading={app.isLoadingGames} />
                <GameTable settings={settings} title="Released Games" games={app.releasedGames} loading={app.isLoadingGames} />
            </div>
        </>
    );
});

const SettingsDrawer = observer((props: IModels) => {
    const { app, settings } = props;

    const [apiKeyInput, setApiKeyInput] = React.useState(settings.apiKey || "");
    React.useEffect(() => {
        setApiKeyInput(settings.apiKey || "");
    }, [settings.apiKey]);

    return (
        <Modal closeOnDimmerClick={true} closeOnEscape={true} onClose={() => (app.isSettingsOpen = false)} open={app.isSettingsOpen}>
            <Modal.Header>Settings</Modal.Header>
            <Modal.Content>
                <p>
                    <Input
                        label="Giant Bomb API Key"
                        error={settings.apiKey == null}
                        fluid
                        value={apiKeyInput}
                        onChange={(e, data) => setApiKeyInput(data.value)}
                        placeholder="YOUR_GB_API_KEY"
                        type="text"
                        action={{ primary: true, content: "Save", onClick: () => (settings.apiKey = apiKeyInput) } as ButtonProps}
                    />
                </p>
                <p>
                    <Checkbox
                        label="Platform Icons"
                        toggle
                        checked={settings.platformStyle === "icons"}
                        onClick={() => settings.cyclePlatformStyle()}
                    />
                </p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => (app.isSettingsOpen = false)}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
});

const GameTable = observer((props: { title: string; games: IGameInfo[]; loading: boolean; settings: SettingsModel }) => {
    return (
        <div className="game-table">
            <h3>{props.title}</h3>
            <Table unstackable celled selectable>
                <Table.Header>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Platforms</Table.HeaderCell>
                    <Table.HeaderCell>Release</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {props.games.map(g => (
                        <Table.Row>
                            <Table.Cell>
                                <a href={g.link} target="_blank">
                                    {g.name}
                                </a>
                            </Table.Cell>
                            <Table.Cell>
                                <PlatformIcons settings={props.settings} platforms={g.platforms} />
                            </Table.Cell>
                            <Table.Cell>{moment(g.release).fromNow()}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
});
