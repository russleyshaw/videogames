import * as React from "react";
import { observer } from "mobx-react";

import {
    TableContainer,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    Link,
    Paper,
    Grid,
    Typography,
    useTheme,
    Tooltip,
    CircularProgress,
} from "@material-ui/core";
import Platforms from "./Platforms";
import { GameData, fromNow } from "../util";

export interface GameListProps {
    games: GameData[];
    title: string;
    tooltip: string;
    loading?: boolean;
}

export default observer((props: GameListProps) => {
    const theme = useTheme();

    const loadingRow = (
        <TableRow key="loading">
            <TableCell>Loading...</TableCell>
            <TableCell>
                <CircularProgress />
            </TableCell>
            <TableCell>Soon</TableCell>
        </TableRow>
    );

    const gameRows = props.games.map(g => (
        <TableRow key={g.name}>
            <TableCell>
                <Link href={g.link} rel="noopener noreferrer" target="_blank">
                    {g.name}
                </Link>
            </TableCell>
            <TableCell>
                <Platforms platforms={g.platforms} />
            </TableCell>
            <TableCell>
                {!g.firm ? "maybe " : ""}
                {fromNow(g.release)}
            </TableCell>
        </TableRow>
    ));

    return (
        <Paper>
            <Grid container>
                <Tooltip title={props.tooltip}>
                    <Typography style={{ margin: theme.spacing(2) }} align="center" variant="h4">
                        {props.title}
                    </Typography>
                </Tooltip>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Platforms</TableCell>
                                <TableCell>Release</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>{props.loading ? loadingRow : gameRows}</TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Paper>
    );
});
