declare module "*.svg" {
    const content: string;
    export default content;
}

interface PlatformData {
    id: number;
    abbrev: string;
    name: string;
    link: string;
}
