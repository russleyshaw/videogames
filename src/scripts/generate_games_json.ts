import * as dotenv from "dotenv";
dotenv.config();

import * as _ from "lodash";
import * as moment from "moment";
import { promises as fsp } from "fs";
import { asNotNil } from "../common/util";
import * as gbapi from "../common/gbapi";

const API_KEY = asNotNil(
    process.env.API_KEY,
    "Expected envvar API_KEY to be provided. Get yours at https://giantbomb.com/api !"
);

export async function main(): Promise<void> {
    const now = moment();
    const month = now.month();
    const year = now.year();

    const months: Array<{ month: number; year: number }> = [];
    months.push({ month, year });
    months.push({
        month: month < 11 ? month + 1 : 0,
        year: month < 11 ? year : year + 1,
    });
    months.push({
        month: month > 0 ? month - 1 : 11,
        year: month > 0 ? year : year - 1,
    });

    const games = _.flatten(
        await Promise.all(
            months.map(async d => {
                return gbapi.getAllGames({
                    apiKey: API_KEY,
                    filters: {
                        expected_release_month: d.month + 1,
                        expected_release_year: d.year,
                    },
                });
            })
        )
    );

    // Some stats
    console.log(`Found ${games.length} games total.`);
    console.log(
        `Found ${games.filter(g => g.original_release_date == null).length} unreleased games`
    );
    console.log(
        `Found ${games.filter(g => g.original_release_date != null).length} released games.`
    );

    await fsp.writeFile("games.json", JSON.stringify(games));
}

main();
