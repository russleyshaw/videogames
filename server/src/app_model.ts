import { HOURS_TO_MS, compareDates } from "./util";
import { GBApi, getEstimatedReleaseDate } from "./gbapi";

import { IGameInfo } from "common";

export interface IAppModelOptions {
    apiKey: string;
}

export class AppModel {
    updateIntervalMs: number;
    updateInterval: any;
    isUpdating: boolean;

    cache: Map<number, IGameInfo>;
    gbapi: GBApi;

    constructor(options: IAppModelOptions) {
        this.cache = new Map();
        this.updateIntervalMs = HOURS_TO_MS * 3;
        this.isUpdating = false;

        this.gbapi = new GBApi(options.apiKey);
    }

    start() {
        this.update();
        this.updateInterval = setInterval(() => {
            this.update();
        }, this.updateIntervalMs);
    }

    getUpcoming(): IGameInfo[] {
        const games = Array.from(this.cache.values());
        const nowDate = new Date();
        return games.filter(g => g.release > nowDate).sort((a, b) => compareDates(a.release, b.release));
    }

    getReleased(): IGameInfo[] {
        const games = Array.from(this.cache.values());
        const nowDate = new Date();
        return games.filter(g => g.release < nowDate).sort((a, b) => compareDates(b.release, a.release));
    }

    async update() {
        if (this.isUpdating) {
            console.warn("App is already updating...");
            return;
        }

        console.log("Updating releases list...");
        this.isUpdating = true;

        const nowDate = new Date();

        // TODO: This only gets the first 100 at most.
        // TODO: This could have trouble getting games that are soon to come out in the next month.
        const res = await this.gbapi.getGames({
            expected_release_year: nowDate.getFullYear(),
            expected_release_month: nowDate.getMonth() + 1 // Add 1 because GB API expects 1-12 month.
        });

        for (const entry of res.results) {
            const release = getEstimatedReleaseDate(entry);
            if (release == null) {
                continue;
            }

            this.cache.set(entry.id, {
                id: entry.id,
                name: entry.name,
                release,
                platforms: (entry.platforms || []).map(p => p.abbreviation)
            });
        }

        this.isUpdating = false;
        console.log("Updated releases list!");
    }

    stop() {
        clearInterval(this.updateInterval);
    }
}
