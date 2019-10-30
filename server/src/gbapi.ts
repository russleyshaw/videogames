import * as path from "path";
import moment = require("moment");

export interface IGbApiGamesResult {
    id: number;
    guid: string;
    name: string;
    deck: string;

    original_release_date?: string;

    expected_release_day?: number;
    expected_release_month?: number;
    expected_release_quarter?: number;
    expected_release_year?: number;

    platforms?: Array<{
        id: number;
        name: string;
        abbreviation: string;
    }>;
}

export interface IGBApiGames {
    error: string;
    limit: number;
    offset: number;
    number_of_page_results: number;
    number_of_total_results: number;
    results: Array<IGbApiGamesResult>;
}

export interface IGBApiGamesOptions {
    offset?: number;
    expected_release_day?: number;
    expected_release_month?: number;
    expected_release_year?: number;
}

export class GBApi {
    apiKey: string;
    apiBaseUrl: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiBaseUrl = "https://www.giantbomb.com/api/";
    }

    async getGames(options?: IGBApiGamesOptions): Promise<IGBApiGames> {
        const url = new URL(this.apiBaseUrl);
        url.pathname = path.join(url.pathname, "games");
        url.searchParams.set("format", "json");
        url.searchParams.set("api_key", this.apiKey);
        const filters = [];

        if (options) {
            if (options.expected_release_day != null) {
                filters.push(`expected_release_day:${options.expected_release_day.toString()}`);
            }
            if (options.expected_release_month != null) {
                filters.push(`expected_release_month:${options.expected_release_month.toString()}`);
            }
            if (options.expected_release_year != null) {
                filters.push(`expected_release_year:${options.expected_release_year.toString()}`);
            }
            if (options.offset != null) {
                url.searchParams.set("offset", options.offset.toString());
            }
        }

        if (filters.length > 0) {
            url.searchParams.set("filter", filters.join(","));
        }

        const result = await fetch(url.toString());

        return result.json();
    }
}

/**
 * Estimate game release date based on either given release date or expected release date.
 * @param game
 */
export function getEstimatedReleaseDate(game: IGbApiGamesResult): Date | undefined {
    if (game.original_release_date != null) {
        return new Date(game.original_release_date);
    }

    if (game.expected_release_year == null) {
        // Not much to do without a year.
        return undefined;
    }

    const mDate = moment(0);
    mDate.year(game.expected_release_year);

    if (game.expected_release_month != null) {
        // Set to found month.
        mDate.month(game.expected_release_month - 1);
    } else if (game.expected_release_quarter != null) {
        // Set to provided quarter.
        mDate.quarter(game.expected_release_quarter);
    } else {
        // Set to last month in year.
        return mDate.endOf("year").toDate();
    }

    if (game.expected_release_day != null) {
        mDate.date(game.expected_release_day);
    } else {
        // Set to last day in month.
        mDate.endOf("month");
    }

    return mDate.toDate();
}
