import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "isomorphic-fetch";
import cors from "cors";
import serveStatic from "serve-static";
import * as path from "path";

import { expectEnvString, expectEnvInt } from "./util";
import { AppModel } from "./app_model";

const IS_DEVMODE = process.env.NODE_ENV === "development";
const API_KEY = expectEnvString("API_KEY");
const PORT = expectEnvInt("PORT", 3000);

async function main() {
    const server = express();

    server.use(cors());

    const appModel = new AppModel({
        apiKey: API_KEY
    });

    server.get("/api/upcoming", (req, res) => {
        const games = appModel.getUpcoming();
        res.json(games);
    });

    server.get("/api/released", (req, res) => {
        const games = appModel.getReleased();
        res.json(games);
    });

    server.use("/", serveStatic(path.join(__dirname, "../../site/dist")));

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
        appModel.start();
    });
}

main().catch(e => console.error(e.toString(), e));
