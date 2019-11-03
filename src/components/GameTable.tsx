import React from "react";
import { observer } from "mobx-react";
import { Table, Popup } from "semantic-ui-react";
import PlatformIcons from "./PlatformIcons";
import moment from "moment";
import { IGameInfo } from "../types";

export default observer((props: { title: string; games: IGameInfo[]; loading: boolean }) => {
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
                    {props.games.map(g => {
                        const relativeRelease = moment(g.release).fromNow();
                        const absoluteRelase = moment(g.release).format("MM/DD/YYYY");

                        return (
                            <Table.Row>
                                <Table.Cell>
                                    <a href={g.link} target="_blank">
                                        {g.name}
                                    </a>
                                </Table.Cell>
                                <Table.Cell>
                                    <PlatformIcons platforms={g.platforms} />
                                </Table.Cell>
                                <Table.Cell>
                                    <Popup position="top center" trigger={<span>{relativeRelease}</span>} content={absoluteRelase} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
});
