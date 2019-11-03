import { observable, computed, action, runInAction } from "mobx";
import moment from "moment";

import { getGames, getEstimatedReleaseDate } from "../gbapi";
import { compareDates, resolveAllSeq } from "../util";
import { IGameInfo } from "../types";
import { GAME_CACHE_KEY } from "../constants";

export default class AppModel {
    @observable
    games: Map<number, IGameInfo> = new Map();

    @observable
    isLoadingGames: boolean = false;

    @observable
    loadingProgress: number = 0;

    @observable
    isSettingsOpen: boolean = false;

    @observable
    isAboutOpen: boolean = false;

    constructor() {
        this.loadGameCache();
    }

    saveGameCache() {
        const gameData = JSON.stringify(Array.from(this.games.values()).map(g => ({ ...g, release: g.release.toISOString() })));

        localStorage.setItem(GAME_CACHE_KEY, gameData);
    }

    loadGameCache(): IGameInfo[] | undefined {
        const gameData = localStorage.getItem(GAME_CACHE_KEY);

        if (gameData == null) return undefined;

        try {
            const games: IGameInfo[] = JSON.parse(gameData).map((g: any) => ({ ...g, release: new Date(g.release) }));
            this.games = new Map(games.map(g => [g.id, g]));
        } catch (e) {
            console.warn("Failed to parse games storage.");
            return undefined;
        }
    }

    @action
    async updateGames(apiKey: string): Promise<void> {
        const now = new Date();
        const months = [
            now,
            moment(now)
                .add(1, "month")
                .toDate(),
            moment(now)
                .subtract(1, "month")
                .toDate()
        ];

        this.isLoadingGames = true;
        this.loadingProgress = 0;
        let loadedCount = 0;
        let totalCount = months.length;

        const responses = await resolveAllSeq(
            months.map(async date => {
                const games = await getGames({
                    apiKey,
                    expected_release_month: date.getMonth() + 1,
                    expected_release_year: date.getFullYear()
                });
                totalCount++;
                this.loadingProgress = loadedCount / totalCount;
                return games;
            })
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
                    platforms: (entry.platforms || []).map(e => ({
                        id: e.id == null ? -1 : e.id,
                        abbreviation: e.abbreviation || "UNKN",
                        name: e.name || "Unknown"
                    })),
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
