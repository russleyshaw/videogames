import { observable } from "mobx";
import moment from "moment";
import { Intent } from "@blueprintjs/core";

import { IGameInfo, getGames, getEstimatedReleaseDate } from "./gbapi";
import { compareDates } from "./util";
import { appToaster } from "./toaster";

const APIKEY_KEY = "apiKey";
const LASTPULLED_KEY = "lastPulled";
const GAMES_KEY = "gamesCache";
export default class AppModel {
    @observable
    apiKey: string | undefined;

    @observable
    games: Map<number, IGameInfo> = new Map();

    @observable
    isLoadingGames: boolean = false;

    @observable
    lastCached: Date | undefined;

    constructor() {
        const apiKey = localStorage.getItem(APIKEY_KEY);
        if (apiKey != null && apiKey != "") {
            this.apiKey = apiKey;
            // this.updateGames();
        }

        this.loadGameCache();
    }

    setApiKey(apiKey: string) {
        this.apiKey = apiKey;
        localStorage.setItem(APIKEY_KEY, this.apiKey);
        this.updateGames();
    }
    clearApiKey() {
        localStorage.removeItem(APIKEY_KEY);
        this.apiKey = undefined;
    }

    saveGameCache() {
        const gameData = JSON.stringify(Array.from(this.games.values()).map(g => ({ ...g, release: g.release.toISOString() })));
        this.lastCached = new Date();

        localStorage.setItem(LASTPULLED_KEY, this.lastCached.toISOString());
        localStorage.setItem(GAMES_KEY, gameData);
    }

    loadGameCache(): IGameInfo[] | undefined {
        const gameData = localStorage.getItem(GAMES_KEY);
        const lastPulled = localStorage.getItem(LASTPULLED_KEY);

        if (lastPulled != null) {
            this.lastCached = new Date(lastPulled);
            appToaster.show({
                message: `Last pulled ${moment(this.lastCached).fromNow()}.`
            });
        }

        if (gameData == null) return undefined;

        try {
            const games: IGameInfo[] = JSON.parse(gameData).map((g: any) => ({ ...g, release: new Date(g.release) }));
            this.games = new Map(games.map(g => [g.id, g]));
            appToaster.show({
                message: `Found ${this.games.size} games.`
            });
        } catch (e) {
            appToaster.show({
                message: `Failed to parse previously stored games. ${e.toString()}`,
                intent: Intent.WARNING
            });
            console.warn("Failed to parse games storage.");
            return undefined;
        }
    }

    async updateGames(force?: boolean): Promise<void> {
        const now = new Date();
        const nextMonth = moment(now)
            .add(1, "month")
            .toDate();
        const lastMonth = moment(now)
            .subtract(1, "month")
            .toDate();

        if (this.apiKey == null) {
            return;
        }

        if (this.lastCached != null && moment.duration(moment(now).diff(this.lastCached)).asHours() < 1 && force != true) {
            appToaster.show({
                message: `Polled recently (${moment(this.lastCached).fromNow()}). Skipping.`
            });
            return;
        }

        const apiKey = this.apiKey;
        this.isLoadingGames = true;
        appToaster.show(
            {
                message: "Loading new releases..."
            },
            "loading-releases"
        );

        const responses = await Promise.all(
            [now, nextMonth, lastMonth].map(date =>
                getGames({
                    apiKey,
                    expected_release_month: date.getMonth() + 1,
                    expected_release_year: date.getFullYear()
                })
            )
        );

        for (const res of responses) {
            for (const entry of res.results) {
                const release = getEstimatedReleaseDate(entry);
                if (release == null) {
                    continue;
                }

                this.games.set(entry.id, {
                    id: entry.id,
                    name: entry.name,
                    platforms: (entry.platforms || []).map(p => p.abbreviation),
                    release,
                    link: entry.site_detail_url
                });
            }
        }

        this.saveGameCache();
        appToaster.show(
            {
                message: `Loaded ${this.games.size} releases!`,
                intent: Intent.SUCCESS
            },
            "loading-releases"
        );
        this.isLoadingGames = false;
    }

    getUpcomingGames(): IGameInfo[] {
        const now = new Date();
        return Array.from(this.games.values())
            .filter(g => g.release > now)
            .sort((a, b) => compareDates(a.release, b.release));
    }

    getReleasedGames(): IGameInfo[] {
        const now = new Date();
        return Array.from(this.games.values())
            .filter(g => g.release < now)
            .sort((a, b) => compareDates(b.release, a.release));
    }
}
