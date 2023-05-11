import { observer } from "mobx-react";

import Platforms from "./Platforms";
import classes from "./GameList.module.scss";
import { GameData, fromNow } from "../util";

export interface GameListProps {
    games: GameData[];
    title: string;
    subtitle: string | JSX.Element;
    loading?: boolean;
}

export default observer((props: GameListProps) => {
    const loadingRow = (
        <>
            <span>Loading...</span>
            <span></span>
            <span>Soon</span>
        </>
    );

    const gameRows = props.games.map(g => (
        <>
            <div className={classes.nameCol}>
                <a href={g.link} rel="noopener noreferrer" target="_blank">
                    {g.name}
                </a>
            </div>
            <div className={classes.platformCol}>
                <Platforms platforms={g.platforms} />
            </div>
            <div className={classes.releaseCol}>
                <span>
                    {!g.firm ? "maybe " : ""}
                    {fromNow(g.release)}
                </span>
            </div>
        </>
    ));

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>{props.title}</h3>
            <span className={classes.subtitle}>{props.subtitle}</span>
            <div className={classes.gameTable}>
                <div className={classes.nameCol}>Name</div>
                <div className={classes.platformCol}>Platforms</div>
                <div className={classes.releaseCol}>Release</div>
                {props.loading ? loadingRow : gameRows}
            </div>
        </div>
    );
});
