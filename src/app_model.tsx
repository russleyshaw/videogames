import { observable } from "mobx";

import { IGameInfo, getGames, getEstimatedReleaseDate } from "./gbapi";
import { compareDates } from "./util";

const APIKEY_KEY = "apiKey";
export default class AppModel {
    @observable
    apiKey: string | undefined;

    @observable
    games: Map<number, IGameInfo> = new Map();

    @observable
    isLoadingGames: boolean = false;

    constructor() {
        const apiKey = localStorage.getItem(APIKEY_KEY);
        if (apiKey != null && apiKey != "") {
            this.apiKey = apiKey;
            this.updateGames();
        }
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

    async updateGames(): Promise<void> {
        if (this.apiKey == null) {
            return;
        }

        this.isLoadingGames = true;
        const nowDate = new Date();
        const res = await getGames({
            apiKey: this.apiKey,
            expected_release_month: nowDate.getMonth() + 1,
            expected_release_year: nowDate.getFullYear()
        });

        for (const entry of res.results) {
            const release = getEstimatedReleaseDate(entry);
            if (release == null) {
                continue;
            }

            this.games.set(entry.id, {
                id: entry.id,
                name: entry.name,
                platforms: (entry.platforms || []).map(p => p.abbreviation),
                release
            });
        }

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
