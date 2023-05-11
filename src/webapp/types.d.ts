declare module "*.svg" {
    const content: string;
    export default content;
}

// declare module "*.json" {
//     const content: string;
//     export default content;
// }

interface PlatformData {
    id: number;
    abbrev: string;
    name: string;
    link: string;
}

declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}
