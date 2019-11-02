import { observable, computed, action, runInAction } from "mobx";
import moment from "moment";

import { IGameInfo, getGames, getEstimatedReleaseDate } from "../gbapi";
import { compareDates } from "../util";
import settings from "./settings_store";

const LASTPULLED_KEY = "lastPulled";
const GAMES_KEY = "gamesCache";
export default class AppModel {
    @observable
    games: Map<number, IGameInfo> = new Map();

    @observable
    isLoadingGames: boolean = false;

    @observable
    lastCached: Date | undefined;

    @observable
    isSettingsOpen: boolean = false;

    @observable
    isAboutOpen: boolean = false;

    constructor() {
        this.loadGameCache();
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
        }

        if (gameData == null) return undefined;

        try {
            const games: IGameInfo[] = JSON.parse(gameData).map((g: any) => ({ ...g, release: new Date(g.release) }));
            this.games = new Map(games.map(g => [g.id, g]));
        } catch (e) {
            console.warn("Failed to parse games storage.");
            return undefined;
        }
    }

    async updateGames(): Promise<void> {
        const now = new Date();
        const nextMonth = moment(now)
            .add(1, "month")
            .toDate();
        const lastMonth = moment(now)
            .subtract(1, "month")
            .toDate();

        const apiKey = settings.apiKey;
        if (apiKey == null) {
            return;
        }

        this.isLoadingGames = true;

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

        this.isLoadingGames = false;
    }

    @computed
    get upcomingGames(): IGameInfo[] {
        const now = new Date();
        return Array.from(this.games.values())
            .filter(g => g.release > now)
            .sort((a, b) => compareDates(a.release, b.release));
    }

    @computed
    get releasedGames(): IGameInfo[] {
        const now = new Date();
        return Array.from(this.games.values())
            .filter(g => g.release < now)
            .sort((a, b) => compareDates(b.release, a.release));
    }
}
