import { addDays, startOfDay, formatDistanceToNow } from "date-fns";

export interface GameData {
    id: number;
    name: string;
    link: string;
    release: Date;
    firm: boolean;
    released: boolean;
    platforms: Array<PlatformData>;
}

export const NOW = new Date();
export const START_OF_TODAY = startOfDay(NOW);
export const START_OF_TOMORROW = startOfDay(addDays(NOW, 1));
export const START_OF_NEXT_DAY = startOfDay(addDays(NOW, 2));;

export function fromNow(date: Date): string {
    if (START_OF_TODAY < date && START_OF_TOMORROW > date) {
        return "Today!";
    }

    if (START_OF_TOMORROW < date && START_OF_NEXT_DAY > date) {
        return "Tomorrow!";
    }

    return formatDistanceToNow(date);
}
