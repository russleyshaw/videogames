export function compareDates(a: Date, b: Date): number {
    return a.valueOf() - b.valueOf();
}

export const HOURS_TO_MS = 1000 * 60 * 60;

export function contains<T>(items: T[], search: T, compare?: (a: T, b: T) => boolean): boolean {
    const comparer = compare || ((a: T, b: T) => a === b);
    const foundIdx = items.findIndex(item => comparer(item, search));
    return foundIdx >= 0;
}

export async function resolveAllSeq<T>(items: Array<Promise<T>>): Promise<T[]> {
    const results = [];
    for (const item of items) {
        results.push(await item);
    }

    return results;
}

export function groupBy<T>(items: T[], grouper: (item: T) => string): T[][] {
    const groups = new Map<string, T[]>();

    for (const item of items) {
        const groupKey = grouper(item);
        const group = groups.get(groupKey);
        if (group == null) {
            groups.set(groupKey, [item]);
        } else {
            group.push(item);
        }
    }

    return Array.from(groups.values());
}
