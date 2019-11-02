export function compareDates(a: Date, b: Date): number {
    return a.valueOf() - b.valueOf();
}

export const HOURS_TO_MS = 1000 * 60 * 60;

export function contains<T>(items: T[], search: T, compare?: (a: T, b: T) => boolean): boolean {
    const comparer = compare || ((a: T, b: T) => a === b);
    const foundIdx = items.findIndex(item => comparer(item, search));
    return foundIdx >= 0;
}
