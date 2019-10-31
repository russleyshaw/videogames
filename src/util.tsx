export function compareDates(a: Date, b: Date): number {
    return a.valueOf() - b.valueOf();
}

export const HOURS_TO_MS = 1000 * 60 * 60;
