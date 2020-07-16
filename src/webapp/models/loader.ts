import { observable, computed, action } from "mobx";

interface BaseLoaderResult {
    status: "pending" | "loading" | "loaded" | "error";
}

interface LoaderResultNotLoaded extends BaseLoaderResult {
    status: "pending" | "loading";
}

interface LoaderResultLoaded<T> extends BaseLoaderResult {
    status: "loaded";
    value: T;
}

interface LoaderResultError extends BaseLoaderResult {
    status: "error";
    error: unknown;
}

type LoaderResult<T> = LoaderResultLoaded<T> | LoaderResultNotLoaded | LoaderResultError;

export class LoaderModel<T> {
    @observable
    result: LoaderResult<T>;

    private _getter: () => Promise<T>;

    constructor(getter: () => Promise<T>) {
        this._getter = getter;
        this.result = {
            status: "pending",
        };
    }

    @action
    async load(): Promise<T> {
        this.result = { status: "loading" };
        try {
            const value = await this._getter();
            this.result = { status: "loaded", value };
            return value;
        } catch (e) {
            this.result = { status: "error", error: e };
            throw e;
        }
    }

    @computed
    get value(): T | undefined {
        if (this.result.status === "loaded") {
            return this.result.value;
        }

        return undefined;
    }
}
