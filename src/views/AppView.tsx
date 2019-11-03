import React from "react";
import { observer, inject } from "mobx-react";

import { Button, Table, Input, Menu, Modal, ButtonProps, Message, Checkbox, IconProps, Icon, Popup, Progress } from "semantic-ui-react";
import AboutDialog from "../components/AboutDialog";
import { useSettingsStore, useAppStore } from "../stores";
import GameTable from "../components/GameTable";

export default observer(() => {
    const app = useAppStore();
    const settings = useSettingsStore();

    return (
        <>
            <SettingsDialog />
            <AboutDialog isOpen={app.isAboutOpen} onClose={() => (app.isAboutOpen = false)} />
            <Menu>
                <Menu.Item header>Video Games</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item icon="info" onClick={() => (app.isAboutOpen = true)} />
                    <Menu.Item
                        disabled={app.isLoadingGames}
                        onClick={() => updateGames()}
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
            {app.isLoadingGames && <Progress percent={app.loadingProgress * 100} />}
            <div className="game-tables">
                <GameTable title="Upcoming Games" games={app.upcomingGames} loading={app.isLoadingGames} />
                <GameTable title="Released Games" games={app.releasedGames} loading={app.isLoadingGames} />
            </div>
        </>
    );

    function updateGames() {
        if (settings.apiKey == null) return;
        app.updateGames(settings.apiKey);
    }
});

const SettingsDialog = observer(() => {
    const settings = useSettingsStore();
    const app = useAppStore();

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
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => (app.isSettingsOpen = false)}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
});
