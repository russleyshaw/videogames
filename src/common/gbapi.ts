import axios from "axios";
import * as urlLib from "url";

const GAMES_API_BASEURL = "https://giantbomb.com/api/games";

export interface Game {
    id: number;
    guid: string;
    name: string;
    deck: string;
    site_detail_url: string;

    original_release_date?: string;

    expected_release_day?: number;
    expected_release_month?: number;
    expected_release_quarter?: number;
    expected_release_year?: number;

    platforms?: Platform[];
}

export interface Platform {
    id: number;
    name: string;
    abbreviation: string;
}

export interface GetGamesResult {
    error: string;
    limit: number;
    offset: number;
    number_of_page_results: number;
    number_of_total_results: number;
    results: Array<Game>;
}

export interface GetGamesOptions {
    apiKey: string;
    offset?: number;
    field_list?: string[];
    filters?: {
        expected_release_day?: number;
        expected_release_month?: number;
        expected_release_quarter?: number;
        expected_release_year?: number;
    };
}

export async function getGames(opts: GetGamesOptions): Promise<GetGamesResult> {
    const url = new urlLib.URL(GAMES_API_BASEURL);
    url.searchParams.set("format", "json");
    url.searchParams.set("api_key", opts.apiKey);

    // Filters
    const filters: string[] = [];
    for (const [k, v] of Object.entries(opts.filters ?? {})) {
        if (v == null) continue;
        filters.push(`${k}:${encodeURIComponent(v)}`);
    }
    url.searchParams.set("filter", filters.join(","));

    if (opts.field_list != null && opts.field_list.length > 0) {
        url.searchParams.set("field_list", opts.field_list.join(","));
    }

    // Offset
    if (opts.offset != null) {
        url.searchParams.set("offset", opts.offset.toString());
    }

    const response = await axios<GetGamesResult>({
        method: "get",
        url: url.toString(),
    });
    return response.data;
}

export async function getAllGames(opts: GetGamesOptions): Promise<Game[]> {
    const games: Game[] = [];
    let result = await getGames({ ...opts, offset: 0 });

    games.push(...result.results);
    let offset = result.number_of_page_results;

    while (result.number_of_page_results > 0) {
        result = await getGames({ ...opts, offset });
        games.push(...result.results);
        offset += result.number_of_page_results;
    }

    return games;
}
