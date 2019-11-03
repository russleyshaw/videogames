export interface IPlatformInfo {
    id: number;
    name: string;
    abbreviation: string;
}

export interface IGameInfo {
    id: number;
    name: string;
    release: Date;
    link: string;
    platforms: IPlatformInfo[];
}
