export function expectEnvString(key: string, defaultValue?: string): string {
    const val = process.env[key];

    if (val == null && defaultValue != null) {
        return defaultValue;
    }

    if (typeof val !== "string") {
        throw new Error(`Expected environment variable '${key}' to exist.`);
    }

    return val;
}

export function expectEnvInt(key: string, defaultValue?: number): number {
    const val = process.env[key];

    if (val == null && defaultValue != null) {
        return defaultValue;
    }

    if (typeof val !== "string") {
        throw new Error(`Expected environment variable '${key}' to exist.`);
    }

    const numVal = parseInt(val, 10);
    if (Number.isNaN(numVal)) {
        throw new Error(`Expected environment variable '${key}' to be an integer.`);
    }

    return numVal;
}

export function compareDates(a: Date, b: Date): number {
    return a.valueOf() - b.valueOf();
}

export function defaultTo<T, U = T>(value: T | null | undefined, defaultValue: U): T | U {
    return value == null ? defaultValue : value;
}

export const HOURS_TO_MS = 1000 * 60 * 60;
