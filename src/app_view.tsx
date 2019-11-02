import React from "react";
import { observer } from "mobx-react";
import moment from "moment";

import AppModel from "./models/app_model";
import { IGameInfo } from "./gbapi";

import { Button, Table, Input, Menu, Modal, ButtonProps, Message, Checkbox, IconProps, Icon } from "semantic-ui-react";
import SettingsModel from "./models/settings_model";
import PlatformIcons from "./components/PlatformIcons";
import AboutDialog from "./components/AboutDialog";

interface IModels {
    app: AppModel;
    settings: SettingsModel;
}

export default observer((props: IModels) => {
    const { app, settings } = props;

    return (
        <>
            <SettingsDialog {...props} />
            <AboutDialog isOpen={app.isAboutOpen} onClose={() => (app.isAboutOpen = false)} />
            <Menu>
                <Menu.Item header>Video Games</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item icon="info" onClick={() => (app.isAboutOpen = true)} />
                    <Menu.Item
                        disabled={app.isLoadingGames}
                        onClick={() => app.updateGames()}
                        icon={{ name: "refresh", loading: app.isLoadingGames } as IconProps}
                    />
                    <Menu.Item icon="setting" onClick={() => (app.isSettingsOpen = true)} />
                </Menu.Menu>
            </Menu>
            {settings.apiKey == null && (
                <Message negative>
                    Add your Giant Bomb API key in the <Icon fitted name="setting" /> settings. You can get your key from{" "}
                    <a href="https://giantbomb.com/api" target="_blank">
                        here!
                    </a>
                </Message>
            )}
            <div className="game-tables">
                <GameTable settings={settings} title="Upcoming Games" games={app.upcomingGames} loading={app.isLoadingGames} />
                <GameTable settings={settings} title="Released Games" games={app.releasedGames} loading={app.isLoadingGames} />
            </div>
        </>
    );
});

const SettingsDialog = observer((props: IModels) => {
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
                        action={
                            { icon: "save", primary: true, content: "Save", onClick: () => (settings.apiKey = apiKeyInput) } as ButtonProps
                        }
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
