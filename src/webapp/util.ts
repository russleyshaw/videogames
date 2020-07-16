import * as moment from "moment";

export interface GameData {
    id: number;
    name: string;
    link: string;
    release: moment.Moment;
    firm: boolean;
    released: boolean;
    platforms: Array<PlatformData>;
}

export const NOW = moment();
export const START_OF_TODAY = moment(NOW).startOf("date");
export const START_OF_TOMORROW = moment(NOW).add(1, "day").startOf("date");
export const START_OF_NEXT_DAY = moment(NOW).add(2, "day").startOf("date");

export function fromNow(date: moment.Moment): string {
    if (date.isBetween(START_OF_TODAY, START_OF_TOMORROW)) {
        return "Today!";
    }

    if (date.isBetween(START_OF_TOMORROW, START_OF_NEXT_DAY)) {
        return "Tomorrow!";
    }

    return date.fromNow();
}
