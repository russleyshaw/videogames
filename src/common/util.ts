export function asNotNil<T>(value: T | null | undefined, msg?: string): T {
    if (value == null) {
        throw new Error(msg ?? "Expected value to not be null or undefined.");
    }

    return value;
}

export function filterNil<T>(items: Array<T | null | undefined>): T[] {
    return items.filter(item => item != null) as T[];
}
