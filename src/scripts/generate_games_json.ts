import dotenv from "dotenv";
dotenv.config();

import * as _ from "lodash";
import moment from "moment";
import { promises as fsp } from "fs";
import { asNotNil } from "../common/util";
import * as gbapi from "../common/gbapi";

const API_KEY = asNotNil(process.env.API_KEY, "Expected envvar API_KEY to be provided.");

export async function main(): Promise<void> {
    const now = moment();
    const month = now.month();
    const year = now.year();

    const months: Array<{ month: number; year: number }> = [];
    months.push({ month, year });
    months.push({
        month: month < 11 ? month + 1 : 0,
        year: month < 11 ? year : year + 1
    });
    months.push({
        month: month > 0 ? month - 1 : 11,
        year: month > 0 ? year : year - 1
    });

    const games = _.flatten(
        await Promise.all(
            months.map(async d => {
                return gbapi.getAllGames({
                    apiKey: API_KEY,
                    filters: {
                        expected_release_month: d.month + 1,
                        expected_release_year: d.year
                    }
                });
            })
        )
    );

    console.log(`Found ${games.length} releases.`);

    const solidReleases = games.filter(
        g =>
            g.expected_release_day != null &&
            g.expected_release_month != null &&
            g.expected_release_year != null
    );

    console.log(`Found ${solidReleases.length} releases with dates.`);
    await fsp.writeFile("games.json", JSON.stringify(solidReleases));
}

main();
