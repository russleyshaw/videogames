import * as _ from "lodash";

export function asNotNil<T>(value: T | null | undefined, msg?: string): T {
    if (value == null) {
        throw new Error(msg ?? "Expected value to not be null or undefined.");
    }

    return value;
}

export function filterNil<T>(items: Array<T | null | undefined>): T[] {
    return items.filter(item => item != null) as T[];
}

export function safeFindIndex<T>(
    items: T[],
    callback: (item: T, index: number) => boolean
): number | null {
    const foundIdx = items.findIndex(callback);
    if (foundIdx < 0) return null;

    return foundIdx;
}

export function randChoice<T>(items: T[]): T {
    return items[_.random(0, items.length - 1)];
}
